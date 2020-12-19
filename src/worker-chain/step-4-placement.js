// Steps 4, 5, & 6 are UNDER CONSTRUCTION - see below for details
/*

Slight refactor of these final 3 steps...

Placement should only need to care about getting the next word from the current segment
If the current segment is out of words (i.e. returns false), then we try the next segment, etc.
The segment should worry about what words belong to it

(also need to finish doing our map & symbol conversion for these 3 files)

*/

import { isAWord } from "../util/trie";

import createSegment from "./segment";
import createWord from "./word";

class Placement {
  constructor({ index, placements, segment, state, word }) {
    this.index = index;
    this.placements = placements;
    this.segment = segment;
    this.state = state;
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
    return this.placements[this.index].tiles.split("");
  }

  init() {
    const { down, pattern, perps } = this.segment.getData();
    const placements = [];
    const wordArr = this.word.getArray();
    const wordStr = this.word.getString();
    let { col, row } = this.segment.getData();
    let index = 0;
    let lastIndex;
    let start;
    while (index > -1 && index < wordStr.length - 1) {
      lastIndex = index;
      index = wordStr.slice(index).search(pattern);
      if (index === -1) {
        continue;
      }
      start = (down ? row : col) - index;
      if (
        wordArr.some((letter, letterIndex) => {
          const perpIndex = start + letterIndex;
          if (perps.has(perpIndex)) {
            const { left, right } = perps.get(perpIndex);
            if (!isAWord(`${left || ""}${letter}${right || ""}`)) {
              return true;
            }
          }
          return false;
        })
      ) {
        index = lastIndex + (index || 1);
        continue;
      } else if (down) {
        col = col + start;
      } else {
        row = row + start;
      }
      let tiles = wordStr;
      this.segment.getCounts().forEach((count, letter) => {
        [...Array(count).keys()].forEach(() => {
          tiles = tiles.replace(letter, "");
        });
      });
      tiles = tiles.split("");
      placements.push({ col, down, row, tiles, wordArr });
      index = lastIndex + (index || 1);
    }
    if (!placements.length) {
      return false;
    }
    this.index = 0;
    this.placements = placements;
    return true;
  }
}

export default (config) => {
  const segment = createSegment(config.get(BOARD));
  if (!segment) {
    return false;
  }
  
  const wordConfig = new Map();
  wordConfig.set(BLACKLIST, config.get(BLACKLIST));
  wordConfig.set(SEGMENT, segment);
  wordConfig.set(TRAY, config.get(TRAY));
  const word = createWord(wordConfig);
  if (!word) {
    return false;
  }
  
  const newPlacement = new Placement({ index, placements, segment, state, word });
  if (!newPlacement.init()) {
    return false;
  }
  return newPlacement;
};
