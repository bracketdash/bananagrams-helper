import { WORDLIST_SET } from "../util/symbols";
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
      data.set(WORDLIST_SET, wordlistSet);
      console.log(wordlistSet);
      // data.set(WORDLIST_DYNAMIC, processWords(wordlistSet));
      resolve();
    });
  });
};

export const getWordsForSegment = () => {
  // TODO
};

export const isAWord = (word) => {
  return this.data.get(WORDLIST_SET).has(word);
};
