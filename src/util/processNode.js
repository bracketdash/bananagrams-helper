import { LETTER_COUNTS, WORD_ARRAY, WORD_STRING } from "./symbols";
import decode from "./decode";
import getLetterCounts from "./getLetterCounts";

const byLetterCount = new Map();
const wordlistSet = new Set();
const wordSymbols = new Map();

let i;
let matches;
let matchesLength;
let newSofar;
let node;
let nodes;
let part;
let ref;

const processNode = (index, sofar, nodes, syms) => {
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
    const nextIndex = syms.has(ref) ? syms.get(ref) : index + decode(ref) + 1 - syms.size;
    processNode(nextIndex, newSofar, nodes, syms);
    i += 2;
  }
  return { byLetterCount, wordlistSet, wordSymbols };
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

export default processNode;
