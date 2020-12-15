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
    // TODO: if this.placements doesn't exist, get the possible placements of the word within the segment
    // TODO: --> this.placements.push({ col, down, row, wordArr })
    // TODO: return false if a placement can't be made
  }
  getDelta() {
    return this.placements[this.index];
  }
  getNext() {
    const index = this.index ? this.index + 1 : 1;
    const placements = this.placements;
    const state = this.state;
    if (index < this.placements.length) {
      return createPlacement({ index, placements, segment: this.segment, state, word: this.word });
    }
    let word = this.word.getNext();
    if (word) {
      return createPlacement({ index, placements, segment: this.segment, state, word });
    }
    let segment = this.segment.getNext();
    if (!segment) {
      return false;
    }
    word = createPlacement({ index, placements, segment, state, word });
    while (!word) {
      segment = segment.getNext();
      if (segment) {
        word = createPlacement({ index, placements, segment, state, word });
      } else {
        return false;
      }
    }
    return createPlacement({ index, placements, segment, state, word });
  }
  getPlacedTiles() {
    return this.tiles;
  }
  getState() {
    return this.state;
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
