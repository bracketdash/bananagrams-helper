import { BRANCHES, FINISHES_WORD, PARENT_BRANCH } from "../util/symbols";

import { trieRoot } from "../services/trie";

// TODO: maps & symbols

class Word {
  constructor({ branch, parts, segment, state, word }) {
    const solve = state.getSolve();
    this.blacklist = solve.getBlacklist();
    this.branch = branch;
    this.parts = parts;
    this.segment = segment;
    this.state = state;
    this.tray = state.getTray();
    this.word = word;
    this.wordArr = word ? word.split("") : [];
  }

  getArray() {
    if (!this.wordArr.length) {
      this.wordArr = this.word.split("");
    }
    return this.wordArr;
  }

  getNext() {
    const result = this.getNextValidWord();
    if (!result) {
      return false;
    }
    return new Word({
      branch: result.branch,
      parts: result.parts,
      segment: this.segment,
      state: this.state,
      word: result.word,
    });
  }

  getNextValidWord() {
    const loop = (parts, branch) => {
      const inception = (branch, parts) => {
        let lastPart = parts.pop();
        if (
          ![...branch.get(BRANCHES).entries()].some(([part, childBranch]) => {
            if (lastPart) {
              if (lastPart === part) {
                lastPart = false;
              }
              return false;
            }
            if (this.partMeetsCriteria(part)) {
              parts.push(part);
              branch = childBranch;
              return true;
            }
            return false;
          })
        ) {
          if (branch.has(PARENT_BRANCH)) {
            return inception(branch.get(PARENT_BRANCH), parts);
          } else {
            return false;
          }
        }
        return { branch, parts };
      };
      if (
        branch.has(BRANCHES) &&
        [...branch.get(BRANCHES).entries()].some(([part, childBranch]) => {
          if (this.partMeetsCriteria(parts.join("") + part)) {
            parts.push(part);
            branch = childBranch;
            return true;
          }
          return false;
        })
      ) {
      } else if (branch.has(PARENT_BRANCH)) {
        // TODO: fix inception()
        console.log("Would start inception (returning for now)");
        return;
        const result = inception(branch.get(PARENT_BRANCH), parts);
        if (!result) {
          return false;
        }
        branch = result.branch;
        parts = result.parts;
      } else {
        return false;
      }
      const word = parts.join("");
      if (branch.has(FINISHES_WORD) && this.blacklist.allows(word) && this.segment.allows(word)) {
        return new Word({ branch, parts, segment: this.segment, state: this.state, word });
      } else {
        return loop(parts.slice(), branch);
      }
    };
    return loop(this.parts ? this.parts.slice() : [""], this.branch || trieRoot);
  }

  getString() {
    return this.word;
  }

  init() {
    const result = this.getNextValidWord();
    if (!result) {
      return false;
    }
    this.branch = result.branch;
    this.parts = result.parts;
    this.word = result.word;
    this.wordArr = result.word.split("");
    return true;
  }

  partMeetsCriteria(part) {
    const counts = this.tray.getCountsWith(this.segment.getCounts());
    while (part.length > 0) {
      const letter = part[0];
      let instances = 0;
      part = part.replaceAll(letter, () => {
        instances++;
        return "";
      });
      if (!counts.has(letter) || counts.get(letter) < instances) {
        return false;
      }
    }
    return true;
  }
}

export default ({ segment, state }) => {
  const word = new Word({ segment, state });
  if (!word.init()) {
    return false;
  }
  return word;
};
