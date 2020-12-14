import { createSegment } from "./segment";
import { createWord } from "./word";

class Placement {
  constructor({ index, placement, segment, state, word }) {
    this.index = index;
    this.placement = placement;
    this.segment = segment;
    this.state = state;
    this.word = word;
  }
  init() {
    // TODO: calculate row, col, down, tiles, total
    // TODO: return false if a placement can't be made
  }
  getDelta() {
    const { col, down, row, word } = this;
    const wordArr = word.getArray();
    return { col, down, row, wordArr };
  }
  getNext() {
    const index = this.index ? this.index + 1 : 1;
    if (index < this.total) {
      return createPlacement({ index, placement: this });
    }
    let word = this.word.getNext();
    if (word) {
      return createPlacement({ placement: this, word });
    }
    let segment = this.segment.getNext();
    if (!segment) {
      return false;
    }
    word = createWord({ placement: this, segment });
    while (!word) {
      segment = segment.getNext();
      if (segment) {
        word = createWord({ placement: this, segment });
      } else {
        return false;
      }
    }
    return createPlacement({ placement: this, segment, word });
  }
  getPlacedTiles() {
    return this.tiles;
  }
  getState() {
    return this.state;
  }
}

export const createPlacement = ({ index, placement, segment, state, word }) => {
  segment = segment || createSegment({ state });
  if (!segment) {
    return false;
  }
  word = word || createWord({ segment, state });
  if (!word) {
    return false;
  }
  const newPlacement = new Placement({ index, placement, segment, state, word });
  if (!newPlacement.init()) {
    return false;
  }
  return newPlacement;
};
