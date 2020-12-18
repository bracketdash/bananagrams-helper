import { createPlacement } from "./placement";

class State {
  constructor({ board, parent, placement, solve, tray }) {
    this.board = board;
    this.parent = parent;
    this.placement = placement || createPlacement({ state: this });
    this.solve = solve;
    this.tray = tray || solve.getTray();
  }
  getAdvanced() {
    const placement = createPlacement({ state: this });
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
    return this.board;
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
  getSolve() {
    return this.solve;
  }
  getTray() {
    return this.tray;
  }
  isSolved() {
    return this.tray.isEmpty();
  }
}

export const createState = (config) => new State(config);
