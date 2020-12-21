import createPlacement from "./placement";

class State {
  constructor(blacklist, board, tray, parent, placement) {
    this.blacklist = blacklist;
    this.board = board;
    this.tray = tray;
    this.parent = parent;
    this.placement = placement;
  }

  async getAdvanced() {
    const placement = await createPlacement(this.board, this.blacklist, this.tray);
    if (!placement) {
      return false;
    }
    return new State(this.blacklist, this.board.getNext(placement.getDelta()), this.tray.getNext(placement.getPlacedTiles()), this, placement);
  }

  getBoard() {
    return this.board;
  }

  async getNext() {
    if (!this.parent) {
      return false;
    }
    const placement = await this.parent.getPlacement().getNext();
    if (!placement) {
      return false;
    }
    return new State(this.blacklist, this.board.getNext(placement.getDelta()), this.tray.getNext(placement.getPlacedTiles()), this, placement);
  }

  getPlacement() {
    return this.placement || false;
  }

  getPrev() {
    return this.parent || false;
  }

  getTray() {
    return this.tray;
  }

  isSolved() {
    return this.tray.isEmpty();
  }
}

export default (blacklist, board, tray) => new State(blacklist, board, tray);
