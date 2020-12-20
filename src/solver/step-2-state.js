import { BLACKLIST, BOARD, PARENT_STATE, PLACEMENT, TRAY } from "./util/symbols";

import createPlacement from "./step-3-placement";

class State {
  constructor(config) {
    this.data = config;
  }

  getAdvanced() {
    const $data = this.data;
    const placement = createPlacement($data);
    if (!placement) {
      return false;
    }
    
    const config = new Map();
    config.set(BLACKLIST, $data.get(BLACKLIST));
    config.set(BOARD, $data.get(BOARD).getNext(placement.getDelta()));
    config.set(PARENT_STATE, this);
    config.set(PLACEMENT, placement);
    config.set(TRAY, $data.get(TRAY).getNext(placement.getPlacedTiles()));
    
    return new State(config);
  }

  getBoard() {
    return this.data.get(BOARD);
  }

  getNext() {
    const $data = this.data;
    
    const parent = $data.get(PARENT_STATE);
    if (!parent) {
      return false;
    }
    
    const placement = parent.getPlacement().getNext();
    if (!placement) {
      return false;
    }
    
    const config = new Map();
    config.set(BLACKLIST, $data.get(BLACKLIST));
    config.set(BOARD, $data.get(BOARD).getNext(placement.getDelta()));
    config.set(PARENT_STATE, this);
    config.set(PLACEMENT, placement);
    config.set(TRAY, $data.get(TRAY).getNext(placement.getPlacedTiles()));
    
    return new State(config);
  }

  getPlacement() {
    return this.data.get(PLACEMENT);
  }

  getPrev() {
    return this.data.get(PARENT_STATE);
  }

  getTray() {
    return this.data.get(TRAY);
  }

  isSolved() {
    return this.data.get(TRAY).isEmpty();
  }
}

export default (config) => new State(config);
