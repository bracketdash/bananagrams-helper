import { BRANCHES, FINISHES_WORD, PARENT_BRANCH } from "./symbols";

import wordsTxt from "../assets/words.txt";

import decode from "../util/decode";

// TODO: export const downloadAndUnPackTrie
// TODO: export const isAWord
// TODO: export const trieRoot

class Trie {
  contains(word) {
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
    return loop(this.data, word);
  }
  
  getData() {
    return this.data;
  }
  
  init() {
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
        const processNode = (index, parentBranch) => {
          let node = nodes[index];
          const branch = new Map();
          const branches = new Map();
          branch.set(BRANCHES, branches);
          if (parentBranch) {
            branch.set(PARENT_BRANCH, parentBranch);
          }
          if (node[0] === "!") {
            branch.set(FINISHES_WORD, true);
            node = node.slice(1);
          }
          const matches = node.split(/([A-Z0-9,]+)/g);
          let i = 0;
          while (i < matches.length) {
            const part = matches[i];
            if (!part) {
              i += 2;
              continue;
            }
            const ref = matches[i + 1];
            if (ref === "," || ref === undefined) {
              branches.set(part, new Map([[FINISHES_WORD, true]]));
              i += 2;
              continue;
            }
            branches.set(part, processNode(syms.has(ref) ? syms.get(ref) : index + decode(ref) + 1 - syms.size, branch));
            i += 2;
          }
          return branch;
        };
        const data = new Map();
        data.set(BRANCHES, processNode(0, data).get(BRANCHES));
        this.data = data;
        resolve();
      });
    });
  }
}

export default new Trie();
