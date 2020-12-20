import { BLACKLIST, BLACKLIST_STRING, CURRENT_SOLVE, READY, TRAY, TRAY_STRING, UPDATE_DATA, UPDATE_FUNCTION } from "./util/symbols";

import { downloadAndUnPackTrie } from "./trie";

import createSolve from "../models/solve";
import createTray from "../models/tray";

const data = new Map();

downloadAndUnPackTrie().then(() => {
  const updateConfig = new Map();
  updateConfig.set(READY, true);
  data.get(UPDATE_FUNCTION)(updateConfig);
});

export const onUpdate = (update) => {
  data.set(UPDATE_FUNCTION, update);
};

export const solve = (trayStr, blacklistStr) => {
  if (blacklistStr) {
    data.set(BLACKLIST_STRING, blacklistStr);
  } else if (!data.has(BLACKLIST_STRING)) {
    data.set(BLACKLIST_STRING, "");
  }

  if (trayStr) {
    data.set(TRAY_STRING, blacklistStr);
  } else if (!data.has(TRAY_STRING)) {
    data.set(TRAY_STRING, "");
  }

  const solveConfig = new Map();
  
  solveConfig.set(BLACKLIST, new Set(data.get(BLACKLIST_STRING).split(/\s*,\s*/)));
  solveConfig.set(TRAY, createTray(data.get(TRAY_STRING)));

  solveConfig.set(UPDATE_FUNCTION, (message) => {
    if (data.get(CURRENT_SOLVE) === message.get(CURRENT_SOLVE)) {
      data.get(UPDATE_FUNCTION)(message.get(UPDATE_DATA));
      return true;
    }
    return false;
  });

  data.set(CURRENT_SOLVE, createSolve(solveConfig));
};
