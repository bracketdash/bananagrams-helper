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
    const { col, down, pattern, perps, row } = this.segment.getData();
    const placements = [];
    const wordArr = word.getArray();
    const wordStr = word.getString();
    
    // TODO
    // wordStr.search(pattern) to get the index of
    // the first tile in the first occurence of the segment within the word
    // (in a loop):
    // wordStr.slice(index found previously).search(pattern) for the index (within the word slice!) of
    // the first tile in the next occurence of the segment within the word
    // for each placement candidate, only add it to this.placements if it would not create any invalid perpindicular words
    // perps example: [(3, {left: "ad", right: "l"}), (5, {right: "art"})]
    // placements.push({ col, down, row, wordArr });
    
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
