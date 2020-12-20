import { BRANCHES, FINISHES_WORD, PARENT_BRANCH } from "./symbols";

// TODO

export default () => {
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
      // BRANCH, PARTS, WORD_STRING
      return { branch, parts, word };
    } else {
      return loop(parts.slice(), branch);
    }
  };
  return loop(this.parts ? this.parts.slice() : [""], this.branch || trieRoot);
};
