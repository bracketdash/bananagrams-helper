import { BLACKLIST, BLACKLIST_STRING, CURRENT_SOLVE, TRAY, TRAY_STRING, UPDATE_DATA, UPDATE_FUNCTION } from "./util/symbols";

import Trie from "./classes/Trie";

import createBlacklist from "../factories/blacklist";
import createSolve from "../factories/solve";
import createTray from "../factories/tray";

class Solver {
  constructor() {
    this.data = new Map();
    Trie.init().then(() => {
      this.data.get(UPDATE_FUNCTION)({ ready: true });
    });
  }

  onUpdate(update) {
    this.data.set(UPDATE_FUNCTION, update);
  }

  solve({ blacklistStr, trayStr }) {
    const $data = this.data;
    if (blacklistStr) {
      $data.set(BLACKLIST_STRING, blacklistStr);
    } else if (!$data.has(BLACKLIST_STRING)) {
      $data.set(BLACKLIST_STRING, "");
    }
    if (trayStr) {
      $data.set(TRAY_STRING, blacklistStr);
    } else if (!$data.has(TRAY_STRING)) {
      $data.set(TRAY_STRING, "");
    }
    const solveConfig = new Map();
    solveConfig.set(BLACKLIST, createBlacklist($data.get(BLACKLIST_STRING)));
    solveConfig.set(TRAY, createTray($data.get(TRAY_STRING)));
    solveConfig.set(UPDATE_FUNCTION, (data) => {
      if ($data.get(CURRENT_SOLVE) === data.get(CURRENT_SOLVE)) {
        $data.get(UPDATE_FUNCTION)(data.get(UPDATE_DATA));
        return true;
      }
      return false;
    });
    $data.set(CURRENT_SOLVE, createSolve(solveConfig));
  }
}

export default new Solver();
