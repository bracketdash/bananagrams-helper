const codes = new Map("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((c, n) => [c, n]));
const comboCache = new Map();
const pattern = new RegExp("([0-9A-Z]+):([0-9A-Z]+)");
const syms = new Map();
const byLetterCount = new Map();
const wordlistSet = new Set();
const wordSymbols = new Map();

let byLetter;
let newSofar;
let nextIndex;
let node;
let nodes;
let numSyms;
let part;
let ref;

const decode = (code) => {
  if (codes.has(code)) {
    return codes.get(code);
  }
  const base = 36;
  const codeLength = code.length;
  let num = 0;
  let places = 1;
  let pow = 1;
  let range = base;
  while (places < codeLength) {
    num += range;
    places++;
    range *= base;
  }
  for (let i = codeLength - 1; i >= 0; i--) {
    let d = code.charCodeAt(i) - 48;
    if (d > 10) {
      d -= 7;
    }
    num += d * pow;
    pow *= base;
  }
  codes.set(code, num);
  return num;
};

const downloadAndUnpackWords = () => {
  fetch("/words.txt").then(async (response) => {
    nodes = (await response.text()).split(";");
    nodes.some((node) => {
      const symParts = pattern.exec(node);
      if (!symParts) {
        return true;
      }
      syms.set(symParts[1], decode(symParts[2]));
      return false;
    });
    numSyms = syms.size;
    nodes = nodes.slice(numSyms);
    processNode(0, "");
    byLetterCount.forEach((instanceMap) => {
      const sumSet = new Set();
      [...instanceMap.keys()].sort().forEach((key) => {
        const wordSet = instanceMap.get(key);
        wordSet.forEach((wordSymbol) => {
          sumSet.add(wordSymbol);
        });
        sumSet.forEach((wordSymbol) => {
          if (!wordSet.has(wordSymbol)) {
            wordSet.add(wordSymbol);
          }
        });
      });
    });
    postMessage(wordlistSet);
  });
};

const getWordsForSegment = (blacklist, counts, pattern) => {
  const alphaKey = [...counts]
    .reduce((str, [letter, count]) => {
      str += letter.repeat(count);
      return str;
    }, "")
    .split("")
    .sort()
    .join("");
  if (!comboCache.has(alphaKey)) {
    const entry = new Set();
    let firstLetterDone = false;
    counts.forEach((count, letter) => {
      const wordsByLetterCount = byLetterCount.get(letter).get(count);
      if (!firstLetterDone) {
        wordsByLetterCount.forEach((wordSymbol) => {
          entry.add(wordSymbol);
        });
        firstLetterDone = true;
        return;
      }
      entry.forEach((wordSymbol) => {
        if (!wordsByLetterCount.has(wordSymbol)) {
          entry.delete(wordSymbol);
        }
      });
    });
    const wordMap = new Map();
    entry.forEach((wordSymbol) => {
      const { wordArr, wordStr } = wordSymbols.get(wordSymbol);
      wordMap.set(wordStr, wordArr);
    });
    comboCache.set(alphaKey, wordMap);
  }
  const wordMap = comboCache.get(alphaKey);
  blacklist.forEach((wordStr) => {
    if (wordMap.has(wordStr)) {
      wordMap.delete(wordStr);
    }
  });
  const words = new Map();
  let wordIndex = 0;
  wordMap.forEach((wordArr, wordStr) => {
    if (pattern.test(wordStr)) {
      words.set(wordIndex, { wordArr, wordStr });
      wordIndex++;
    }
  });
  return words;
};

const processNode = (index, sofar) => {
  node = nodes[index];
  let matches;
  if (node[0] === "!") {
    processWord(sofar);
    matches = node.slice(1).split(/([A-Z0-9,]+)/g);
  } else {
    matches = node.split(/([A-Z0-9,]+)/g);
  }
  const matchesLength = matches.length;
  for (let i = 0; i < matchesLength; i += 2) {
    part = matches[i];
    if (!part) {
      continue;
    }
    newSofar = sofar + part;
    ref = matches[i + 1];
    if (ref === "," || ref === undefined) {
      processWord(newSofar);
      continue;
    }
    nextIndex = syms.has(ref) ? syms.get(ref) : index + decode(ref) + 1 - numSyms;
    processNode(nextIndex, newSofar);
  }
};

const processWord = (wordStr) => {
  const wordArr = wordStr.split("");
  const wordSymbol = Symbol(wordStr);
  wordArr
    .reduce((counts, letter) => {
      counts.set(letter, counts.has(letter) ? counts.get(letter) + 1 : 1);
      return counts;
    }, new Map())
    .forEach((instances, letter) => {
      if (!byLetterCount.has(letter)) {
        byLetterCount.set(letter, new Map());
      }
      byLetter = byLetterCount.get(letter);
      if (!byLetter.has(instances)) {
        byLetter.set(instances, new Set());
      }
      byLetter.get(instances).add(wordSymbol);
    });
  wordlistSet.add(wordStr);
  wordSymbols.set(wordSymbol, { wordStr, wordArr });
};

onmessage = function ({ data }) {
  switch (data.action) {
    case "downloadAndUnpackWords":
      downloadAndUnpackWords();
      break;
    case "getWordsForSegment":
      getWordsForSegment(data.blacklist, data.counts, data.pattern);
      break;
    default:
      break;
  }
};
