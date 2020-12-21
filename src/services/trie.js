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
  const letterCounts = wordArr.reduce((counts, letter) => {
    counts.set(letter, counts.has(letter) ? counts.get(letter) + 1 : 1);
    return counts;
  }, new Map());
  const wordSymbol = Symbol();
  letterCounts.forEach((instances, letter) => {
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
  wordSymbols.set(wordSymbol, { letterCounts, wordStr, wordArr });
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
  // TODO
  // if (!comboCache.has(alphabetized letters of tray + segment))
  //   comboCache.get( alphabetized letters ,  map of (wordStr, word objects)  )
  // else {
  //   get the words
  //   add word objects to the comboCache
  // }
  // remove words that are on the blacklist
  // test all the words against the segment pattern
  // return a map of words indexed like an array (0, { wordArr, wordStr }), (1, {...}), ...
};

export const isAWord = (word) => {
  return wordlistSet.has(word);
};
