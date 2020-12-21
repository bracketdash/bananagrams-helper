import decode from "../util/decode";

import wordsTxt from "../assets/words.txt";

const byLetterCount = new Map();
const comboCache = new Map();
const syms = new Map();
const wordlistSet = new Set();
const wordSymbols = new Map();

let i;
let indexPlusOne;
let matches;
let matchesLength;
let newSofar;
let nextIndex;
let node;
let nodes;
let numSyms;
let part;
let ref;

const processNode = (index, sofar) => {
  node = nodes[index];
  if (node[0] === "!") {
    processWord(sofar);
    matches = node.slice(1).split(/([A-Z0-9,]+)/g);
  } else {
    matches = node.split(/([A-Z0-9,]+)/g);
  }
  matchesLength = matches.length;
  i = 0;
  while (i < matchesLength) {
    part = matches[i];
    if (!part) {
      i += 2;
      continue;
    }
    newSofar = sofar + part;
    ref = matches[i + 1];
    if (ref === "," || ref === undefined) {
      processWord(newSofar);
      i += 2;
      continue;
    }
    nextIndex = syms.has(ref) ? syms.get(ref) : index + decode(ref) + 1 - numSyms;
    processNode(nextIndex, newSofar);
    i += 2;
  }
};

const processWord = (wordStr) => {
  const wordArr = wordStr.split("");
  const wordSymbol = Symbol();
  wordArr.reduce((counts, letter) => {
    counts.set(letter, counts.has(letter) ? counts.get(letter) + 1 : 1);
    return counts;
  }, new Map()).forEach((instances, letter) => {
    if (!byLetterCount.has(letter)) {
      byLetterCount.set(letter, new Map());
    }
    const instanceMap = byLetterCount.get(letter);
    [...Array(instances).keys()].forEach((index) => {
      indexPlusOne = index + 1;
      if (!instanceMap.has(indexPlusOne)) {
        instanceMap.set(indexPlusOne, new Set());
      }
      instanceMap.get(indexPlusOne).add(wordSymbol);
    });
  });
  wordlistSet.add(wordStr);
  wordSymbols.set(wordSymbol, { wordStr, wordArr });
};

export const downloadAndUnpackTrie = () => {
  return new Promise((resolve) => {
    fetch(wordsTxt.slice(1)).then(async (response) => {
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
      processNode(0, "");
      resolve();
    });
  });
};

export const getWordsForSegment = (blacklist, segment, tray) => {
  const counts = tray.getCountsWith(segment.getCounts());
  const alphaKey = [...counts].reduce((str, [letter, count]) => {
    str += letter.repeat(count);
    return str;
  }, "").split("").sort().join("");
  if (!comboCache.has(alphaKey)) {
    // TODO: create comboCache entry (alphaKey, Set({ wordArr, wordStr }, {..}, ..))
  }
  const wordSet = comboCache.get(alphaKey);
  blacklist.forEach((word) => {
    if (wordSet.has(word)) {
      wordSet.delete(word);
    }
  });
  wordSet.forEach((word) => {
    if (!segment.allows(word)) {
      wordSet.delete(word);
    }
  });
  // TODO: return a map of words indexed like an array (0, { wordArr, wordStr }), (1, {...}), ...
};

export const isAWord = wordlistSet.has;
