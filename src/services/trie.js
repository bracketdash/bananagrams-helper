import decode from "../util/decode";

import wordsTxt from "../assets/words.txt";

const byLetterCount = new Map();
const comboCache = new Map();
const syms = new Map();
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

export const downloadAndUnpackTrie = () => {
  return new Promise((resolve) => {
    console.time("Compressed words download");
    fetch(wordsTxt.slice(1)).then(async (response) => {
      console.timeEnd("Compressed words download");
      console.time("Syms generation");
      const pattern = new RegExp("([0-9A-Z]+):([0-9A-Z]+)");
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
      console.timeEnd("Syms generation");
      console.time("Generating words from trie");
      processNode(0, "");
      console.timeEnd("Generating words from trie");
      console.time("Caching word sets");
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
      console.timeEnd("Caching word sets");
      resolve();
    });
  });
};

export const getWordsForSegment = (blacklist, segment, tray) => {
  const counts = tray.getCountsWith(segment.getCounts());
  const alphaKey = [...counts]
    .reduce((str, [letter, count]) => {
      str += letter.repeat(count);
      return str;
    }, "")
    .split("")
    .sort()
    .join("");
  if (!comboCache.has(alphaKey)) {
    // TODO: create comboCache entry (alphaKey, Set({ wordArr, wordStr }, {..}, ..))
    const entry = new Set();
    counts.forEach((count, letter) => {
      // byLetterCount.get(letter).get(count);
    });
    comboCache.set(alphaKey, entry);
  }
  const wordSet = comboCache.get(alphaKey);
  blacklist.forEach((word) => {
    if (wordSet.has(word)) {
      wordSet.delete(word);
    }
  });
  const words = new Map();
  let wordIndex = 0;
  wordSet.forEach((word) => {
    if (segment.allows(word.wordStr)) {
      words.set(wordIndex, word);
      wordIndex++;
    }
  });
  return words;
};

export const isAWord = wordlistSet.has;
