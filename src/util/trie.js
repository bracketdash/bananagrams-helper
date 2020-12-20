import { BRANCHES, FINISHES_WORD, PARENT_BRANCH } from "./symbols";

import wordsTxt from "../assets/words.txt";

import processNode from "../util/processNode";
import decode from "../util/decode";

export const trieRoot = new Map();

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
      trieRoot.set(BRANCHES, processNode(0, trieRoot, nodes, syms).get(BRANCHES));
      resolve();
    });
  });
};

export const isAWord = (word) => {
  const loop = (trie, str) => {
    if (
      [...trie.keys()].some((part) => {
        if (str.startsWith(part)) {
          str = str.replace(part, "");
          trie = trie.get(str);
          return true;
        }
        return false;
      })
    ) {
      if (trie.has(FINISHES_WORD)) {
        return true;
      }
      return loop(trie, str);
    }
    return false;
  };
  return loop(trieRoot, word);
};
