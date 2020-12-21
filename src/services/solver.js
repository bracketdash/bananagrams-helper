import { BLACKLIST_STRING, CURRENT_SOLVE, READY, TRAY, UPDATE_FUNCTION } from "../util/symbols";

import { downloadAndUnpackWords } from "./words";

import createSolve from "../models/solve";
import createTray from "../models/tray";

const data = new Map();

downloadAndUnpackWords().then(() => {
  const updateConfig = new Map();
  updateConfig.set(READY, true);
  data.set(READY, true);
  data.get(UPDATE_FUNCTION)(updateConfig);
});

export const onUpdate = (update) => {
  data.set(UPDATE_FUNCTION, update);
};

export const solve = async (trayStr, blacklistStr) => {
  if (blacklistStr) {
    data.set(BLACKLIST_STRING, blacklistStr);
  } else if (!data.has(BLACKLIST_STRING)) {
    data.set(BLACKLIST_STRING, "");
  }

  if (trayStr) {
    data.set(TRAY, blacklistStr);
  } else if (!data.has(TRAY)) {
    data.set(TRAY, "");
  }

  if (!data.get(TRAY) || !data.get(READY)) {
    return;
  }

  data.set(
    CURRENT_SOLVE,
    await createSolve(new Set(data.get(BLACKLIST_STRING).split(/\s*,\s*/)), createTray(data.get(TRAY)), (solve, update) => {
      if (data.get(CURRENT_SOLVE) === solve) {
        data.get(UPDATE_FUNCTION)(update);
        return true;
      }
      return false;
    })
  );
};
