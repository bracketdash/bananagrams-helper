import getPlacements from "../util/getPlacements";

import createSegment from "./segment";
import createWord from "./word";

class Placement {
  constructor(board, blacklist, tray, segment, word) {
    this.board = board;
    this.blacklist = blacklist;
    this.tray = tray;
    this.segment = segment;
    this.word = word;
  }

  getDelta() {
    return this.placements[this.index];
  }

  getNext() {
    const blacklist = this.blacklist;
    const board = this.board;
    const index = this.index ? this.index + 1 : 1;
    const placements = this.placements || [];
    const tray = this.tray;

    if (index < placements.length) {
      return new Placement(board, blacklist, tray, this.segment, this.word, placements, index);
    }

    let word = this.word.getNext();
    if (word) {
      return new Placement(board, blacklist, tray, this.segment, word, placements, index).init();
    }

    let segment = this.segment.getNext();
    if (!segment) {
      return false;
    }

    word = createWord(blacklist, segment, tray);
    while (!word) {
      segment = segment.getNext();
      if (segment) {
        word = createWord(blacklist, segment, tray);
      } else {
        return false;
      }
    }

    return new Placement(board, blacklist, tray, segment, word, placements, index).init();
  }

  getPlacedTiles() {
    return this.placements[this.index].tilesArr;
  }

  init() {
    const placements = getPlacements(this.segment, this.word);
    if (!placements.length) {
      return false;
    }
    this.index = 0;
    this.placements = placements;
    return this;
  }
}

export default (board, blacklist, tray) => {
  const segment = createSegment(board.getArray());
  if (!segment) {
    return false;
  }
  const word = createWord(blacklist, segment, tray);
  if (!word) {
    return false;
  }
  return new Placement(board, blacklist, tray, segment, word).init();
};
