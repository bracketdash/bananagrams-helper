import { BLACKLIST, BLACKLIST_STRING, CURRENT_SOLVE, READY, TRAY, TRAY_STRING, UPDATE_DATA, UPDATE_FUNCTION } from "./util/symbols";

import { downloadAndUnPackTrie } from "../util/trie";

import createSolve from "./step-1-solve";
import createTray from "../data/tray";

class Solver {
  constructor() {
    this.data = new Map();
    downloadAndUnPackTrie().then(() => {
      const updateConfig = new Map();
      updateConfig.set(READY, true);
      this.data.get(UPDATE_FUNCTION)(updateConfig);
    });
  }

  onUpdate(update) {
    this.data.set(UPDATE_FUNCTION, update);
  }

  solve(trayStr, blacklistStr) {
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
    
    solveConfig.set(BLACKLIST, new Set($data.get(BLACKLIST_STRING).split(/\s*,\s*/)));
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
