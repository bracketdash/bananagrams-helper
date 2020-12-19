import { BOARD } from "./util/symbols";

import createPlacement from "./placement";

class State {
  constructor(config) {
    this.data = config;
  }
  
  getAdvanced() {
    const placementData = new Map();
    // TODO: START HERE
    placementData.set();
    const placement = createPlacement(placementData);
    if (!placement) {
      return false;
    }
    return new State({
      board: this.board.getNext(placement),
      parent: this,
      placement,
      tray: this.tray.getNext(placement.getPlacedTiles()),
    });
  }
  
  getBoard() {
    return this.data.get(BOARD);
  }
  
  getNext() {
    const parent = this.parent;
    if (!parent) {
      return false;
    }
    const placement = parent.getPlacement().getNext();
    if (!placement) {
      return false;
    }
    const board = this.board.getNext(placement);
    if (!board) {
      return false;
    }
    return new State({
      blacklist: this.blacklist,
      board,
      parent,
      placement,
      tray: this.tray.getNext(placement.getPlacedTiles()),
    });
  }
  
  getPlacement() {
    return this.placement;
  }
  
  getPrev() {
    return this.previous;
  }
  
  getTray() {
    return this.tray;
  }
  
  isSolved() {
    return this.tray.isEmpty();
  }
}

export default (config) => new State(config);
