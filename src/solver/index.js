import { createBlacklist } from "./blacklist";
import { createSolve } from "./solve";
import { createTray } from "./tray";
import { createTrie } from "./trie";

class Solver {
  constructor() {
    this.solveStart = 0;
    this.trie = createTrie();
    this.trie.init().then(() => {
      this.updateFn({ ready: true });
    });
  }
  getTrie() {
    return this.trie;
  }
  onUpdate(updateFn) {
    this.updateFn = updateFn;
  }
  solve({ blacklistStr, trayStr }) {
    this.solveStart = createSolve({
      blacklist: createBlacklist(blacklistStr),
      solver: this,
      tray: createTray(trayStr),
      update: (update, start) => {
        if (start !== this.solveStart) {
          return false;
        }
        this.updateFn(update);
        return true;
      },
    });
  }
}

export const createSolver = () => new Solver();
