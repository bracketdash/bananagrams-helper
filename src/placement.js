import { createSegment } from "./segment";
import { createWord } from "./word";

class Placement {
  constructor({ index, placements, segment, state, word }) {
    this.index = index;
    this.placements = placements;
    this.segment = segment;
    this.state = state;
    this.word = word;
  }
  init() {
    if (this.placements) {
      return true;
    }
    const { down, pattern, perps } = this.segment.getData();
    let { col, row } = this.segment.getData();
    const placements = [];
    const wordArr = word.getArray();
    const wordStr = word.getString();
    
    // TODO
    let index = 0;
    let lastIndex = 0;
    let valid = true;
    while (valid) {
      index = wordStr.slice(index).search(pattern);
      // down ? row += index : col += index;
      // only push to this.placements if it would not create any invalid perpindicular words
      // perps example: [(3, {left: "ad", right: "l"}), (5, {right: "art"})]
      if (valid) {
        placements.push({ col, down, row, wordArr });
        index = lastIndex + index;
      }
    }
    
    if (!placements.length) {
      return false;
    }
    this.placements = placements;
    return true;
  }
  getDelta() {
    return this.placements[this.index];
  }
  getNext() {
    const index = this.index ? this.index + 1 : 1;
    const placements = this.placements;
    const state = this.state;
    if (index < this.placements.length) {
      return new Placement({ index, placements, segment: this.segment, state, word: this.word });
    }
    let word = this.word.getNext();
    if (word) {
      return new Placement({ index, placements, segment: this.segment, state, word });
    }
    let segment = this.segment.getNext();
    if (!segment) {
      return false;
    }
    word = createWord({ segment, state: this.state });
    while (!word) {
      segment = segment.getNext();
      if (segment) {
        word = createWord({ segment, state: this.state });
      } else {
        return false;
      }
    }
    return new Placement({ index, placements, segment, state, word });
  }
  getPlacedTiles() {
    return this.tiles;
  }
}

export const createPlacement = ({ index, placements, segment, state, word }) => {
  segment = segment || createSegment({ state });
  if (!segment) {
    return false;
  }
  word = word || createWord({ segment, state });
  if (!word) {
    return false;
  }
  const newPlacement = new Placement({ index, placements, segment, state, word });
  if (!newPlacement.init()) {
    return false;
  }
  return newPlacement;
};
