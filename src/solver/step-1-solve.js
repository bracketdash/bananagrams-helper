import { BLACKLIST, BOARD, BOARD_ARRAY, CURRENT_SOLVE, MESSAGE, TRAY, UPDATE_DATA, UPDATE_FUNCTION } from "./util/symbols";

import createBoard from "../data/board";
import createState from "./step-2-state";

class Solve {
  constructor(config) {
    this.data = config;
  }

  handleUpdate(state, message) {
    const data = new Map();
    const updateData = new Map();
    updateData.set(BOARD_ARRAY, state.getBoard().getArray());
    updateData.set(MESSAGE, message);
    updateData.set(TRAY, state.getTray().getString());
    data.set(CURRENT_SOLVE, this);
    data.set(UPDATE_DATA, updateData);
    return this.data.get(UPDATE_FUNCTION)(data);
  }

  init() {
    const stateConfig = new Map();
    stateConfig.set(BLACKLIST, this.data.get(BLACKLIST));
    stateConfig.set(BOARD, createBoard());
    stateConfig.set(TRAY, this.data.get(TRAY));
    this.step(createState(stateConfig));
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

export default (config) => {
  const solve = new Solve(config);
  solve.init();
  return solve;
};
