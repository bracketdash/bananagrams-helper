import { BY_LETTER_COUNT, LETTER_COUNTS, WORD_ARRAY, WORD_STRING, WORD_SYMBOLS, WORDLIST_SET } from "../util/symbols";
import decode from "../util/decode";
import getLetterCounts from "../util/getLetterCounts";

import wordsTxt from "../assets/words.txt";

const byLetterCount = new Map();
const syms = new Map();
const wordlistSet = new Set();
const wordSymbols = new Map();

let i;
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
    wordlistSet.add(sofar);
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
      wordlistSet.add(newSofar);
      processWord(newSofar);
      i += 2;
      continue;
    }
    nextIndex = syms.has(ref) ? syms.get(ref) : index + decode(ref) + 1 - numSyms;
    processNode(nextIndex, newSofar);
    i += 2;
  }
};

const processWord = (word) => {
  const letterCounts = getLetterCounts(word);
  const wordSymbol = Symbol(word);
  letterCounts.forEach((instances, letter) => {
    if (!byLetterCount.has(letter)) {
      byLetterCount.set(letter, new Map());
    }
    const instanceMap = byLetterCount.get(letter);
    [...Array(instances).keys()].forEach((index) => {
      const indexPlusOne = index + 1;
      if (!instanceMap.has(indexPlusOne)) {
        instanceMap.set(indexPlusOne, new Set());
      }
      instanceMap.get(indexPlusOne).add(wordSymbol);
    });
  });
  const wordData = new Map();
  wordData.set(LETTER_COUNTS, letterCounts);
  wordData.set(WORD_ARRAY, word.split(""));
  wordData.set(WORD_STRING, word);
  wordSymbols.set(wordSymbol, wordData);
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
};

export const isAWord = (word) => {
  return data.get(WORDLIST_SET).has(word);
};
