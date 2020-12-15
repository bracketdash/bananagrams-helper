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
    const firstPosition = -(wordArr.length - 1);
    const placements = [];
    const wordArr = word.getArray();
    
    // TODO: finish rewrite below
    
    // Approach A
    
    // TODO: try and get the indexes of where the word matches up to the segment's pattern
    
    // Approach B
    
    [...Array(wordArr.length * 2 + tiles.length - 4).keys()].forEach((index) => {
      const pos = firstPosition + index;
      if (wordArr.some((letter, letterIndex) => {
        
        // TODO: return true if it would create an invalid perpindicular word
        // TODO: return false if it would create an invalid perpindicular word
        
        if (tiles[pos + letterIndex] !== " ") {
          if (tiles[pos + letterIndex] !== letter) {
            valid = false;
          } else if (!overlap) {
            overlap = true;
          }
        }
      })) {
        return;
      }
      let rowAdd = 0;
      let colAdd = 0;
      if (down) {
        rowAdd = pos;
      } else {
        colAdd = pos;
      }
      
      // TODO: do not add placement if any of the placed tiles would create invalid perpindicular words
      placements.push(placement);
      
      // TODO: finish rewrite above
      
    });
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
