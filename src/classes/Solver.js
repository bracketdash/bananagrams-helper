import { createBlacklist } from "../factories/blacklist";
import { createSolve } from "../factories/solve";
import { createTray } from "../factories/tray";
import Trie from "./classes/Trie";

class Solver {
  constructor() {
    Trie.init().then(() => {
      this.update({ ready: true });
    });
  }
  onUpdate(callback) {
    this.update = callback;
  }
  solve({ blacklistStr, trayStr }) {
    this.blacklistStr = blacklistStr || this.blacklistStr || "";
    this.trayStr = trayStr || this.trayStr || "";
    this.currSolve = createSolve({
      blacklist: createBlacklist(this.blacklistStr),
      solver: this,
      tray: createTray(this.trayStr),
      update: (update, solve) => {
        if (solve !== this.currSolve) {
          return false;
        }
        this.update(update);
        return true;
      },
    });
  }
}

export default new Solver();
