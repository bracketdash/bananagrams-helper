import { BRANCHES_KEY, FINISHES_WORD, PARENT_BRANCH } from "./symbols";

class Word {
  constructor({ branch, parts, placement, segment, state, word }) {
    let solve;
    if (state) {
      solve = state.getSolve();
    } else {
      state = placement.getState();
      solve = state.getSolve();
    }
    this.blacklist = solve.getBlacklist();
    this.branch = branch;
    this.parts = parts;
    this.segment = segment;
    this.tray = state.getTray();
    this.trie = solve.getSolver().getTrie();
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
      placement: this.placement,
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
          !branch.get(BRANCHES_KEY).some((childBranch, part) => {
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
      if (branch.has(BRANCHES_KEY)) {
        branch.get(BRANCHES_KEY).some((childBranch, part) => {
          if (this.partMeetsCriteria(part)) {
            parts.push(part);
            branch = childBranch;
            return true;
          }
          return false;
        });
      } else if (branch.has(PARENT_BRANCH)) {
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
        return new Word({ branch, parts, placement: this, segment: this.segment, word });
      } else {
        return loop(parts.slice(), branch);
      }
    };
    return loop(this.parts.slice() || ["a"], this.branch || this.trie.getData().get("a"));
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
  }
  partMeetsCriteria(part) {
    const counts = this.tray.getCountsWith(this.segment);
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

export const createWord = ({ placement, segment, state }) => {
  const word = new Word({ placement, segment, state });
  if (!word.init()) {
    return false;
  }
  return word;
};
