import { createSegment } from "./segment";
import { createWord } from "./word";

class Placement {
  constructor({ index, placements, segment, state, word }) {
    this.index = index;
    this.placements = placements;
    this.segment = segment;
    this.state = state;
    this.trie = state.getSolve().getSolver().getTrie();
    this.word = word;
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
  getState() {
    return this.state;
  }
  init() {
    const { down, pattern, perps } = this.segment.getData();
    const placements = [];
    const wordArr = word.getArray();
    const wordStr = word.getString();
    let { col, row } = this.segment.getData();
    let index = 0;
    let lastIndex = 0;
    let start;
    while (index > -1) {
      index = wordStr.slice(index).search(pattern);
      start = (down ? row : col) - index;
      if (
        wordArr.some((letter, letterIndex) => {
          const perpIndex = start + letterIndex;
          if (perps.has(perpIndex)) {
            const { left, right } = perps.get(perpIndex);
            if (!this.trie.contains(`${left || ""}${letter}${right || ""}`)) {
              return true;
            }
          }
          return false;
        })
      ) {
        index = lastIndex + index;
        continue;
      } else if (down) {
        col = col + start;
      } else {
        row = row + start;
      }
      placements.push({ col, down, row, wordArr });
      index = lastIndex + index;
    }
    if (!placements.length) {
      return false;
    }
    this.placements = placements;
    return true;
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
