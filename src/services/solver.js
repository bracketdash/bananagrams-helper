// TODO: (improvements for after testing as-is)
// get rid of utils/symbols.js and convert data here to just use regular consts or lets
// see if it's feasible to move from solve.js and down into modules/trie.js (and rename it bananabot.js)
// then we would just set the current solve ID here and pass it in the pushMessage with the blacklistStr and trayStr
// move the conversion of the blacklist and tray into the worker file 
// use onmessage as the update listener
// when the user requests a new solve, send the currently running solve the signal to stop execution
// we can use pushMessage and onmessage directly in app.js and get rid of this file
// convert word.js to use the functions directly and synchronously again instead of talking with the worker (since it'll be in the worker too now)

import { BLACKLIST_STRING, CURRENT_SOLVE, MESSAGE, READY, TRAY, UPDATE_FUNCTION } from "../util/symbols";

import { downloadAndUnpackWords } from "./words";

import createSolve from "../models/solve";
import createTray from "../models/tray";

const data = new Map();

downloadAndUnpackWords().then(() => {
  const updateConfig = new Map();
  updateConfig.set(MESSAGE, "Ready!");
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
    data.set(TRAY, trayStr);
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
