import { BY_LETTER_COUNT, WORD_SYMBOLS, WORDLIST_SET } from "../util/symbols";
import decode from "../util/decode";
import processNode from "../util/processNode";
import processWords from "../util/processWords";

import wordsTxt from "../assets/words.txt";

const data = new Map();

export const downloadAndUnPackTrie = () => {
  return new Promise((resolve) => {
    fetch(wordsTxt.slice(1)).then(async (response) => {
      const pattern = new RegExp("([0-9A-Z]+):([0-9A-Z]+)");
      const syms = new Map();
      let nodes = (await response.text()).split(";");
      nodes.some((node) => {
        const symParts = pattern.exec(node);
        if (!symParts) {
          return true;
        }
        syms.set(symParts[1], decode(symParts[2]));
        return false;
      });
      nodes = nodes.slice(syms.size);
      const wordlistSet = processNode(0, "", nodes, syms, new Set());
      const { byLetterCount, wordSymbols } = processWords(wordlistSet);
      data.set(BY_LETTER_COUNT, byLetterCount);
      data.set(WORD_SYMBOLS, wordSymbols);
      data.set(WORDLIST_SET, wordlistSet);
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
