import { BOARD_ARRAY, MESSAGE, TRAY } from "../util/symbols";

import createBoard from "./board";
import createState from "./state";

class Solve {
  constructor(blacklist, tray, update) {
    this.blacklist = blacklist;
    this.tray = tray;
    this.update = update;
  }

  handleUpdate(state, message) {
    const updateData = new Map();
    updateData.set(BOARD_ARRAY, state.getBoard().getArray());
    updateData.set(MESSAGE, message);
    updateData.set(TRAY, state.getTray().getString());
    return this.update(this, updateData);
  }

  init() {
    this.step(createState(this.blacklist, createBoard(), this.tray));
  }

  step(state) {
    if (state.isSolved()) {
      this.handleUpdate(state, "Solution found!");
      return;
    }
    if (!this.tryNextStep(state.getAdvanced(), "Advancing state...")) {
      if (!this.tryNextStep(state.getNext(), "Trying next state...")) {
        let prevState = state.getPrev();
        while (prevState) {
          if (this.tryNextStep(prevState.getNext(), "Trying previous next state...")) {
            return;
          }
          prevState = prevState.getPrev();
        }
        this.handleUpdate(state, "No solutions possible!");
      }
    }
  }

  tryNextStep(state, message) {
    if (state && this.handleUpdate(state, message)) {
      setTimeout(() => this.step(state));
      return true;
    }
    return false;
  }
}

export default (blacklist, tray, update) => {
  const solve = new Solve(blacklist, tray, update);
  solve.init();
  return solve;
};
