import { BLACKLIST, BOARD, PLACEMENTS_ARRAY, PLACEMENT_INDEX, SEGMENT, TILES_ARRAY, TRAY, WORD } from "./util/symbols";
import { isAWord } from "../util/trie";

import createSegment from "./segment";
import createWord from "./word";

class Placement {
  constructor(config) {
    this.data = config;
  }

  getDelta() {
    const $data = this.data;
    return $data.get(PLACEMENTS_ARRAY)[$data.get(PLACEMENT_INDEX)];
  }

  getNext() {
    const $data = this.data;
    const index = $data.has(PLACEMENT_INDEX) ? $data.get(PLACEMENT_INDEX) + 1 : 1;
    const placements = $data.get(PLACEMENTS_ARRAY) || [];
    const blacklist = $data.get(BLACKLIST);
    const tray = $data.get(TRAY);
    
    const config = new Map();
    config.set(BLACKLIST, blacklist);
    config.set(BOARD, $data.get(BOARD));
    config.set(TRAY, tray);
    
    if (index < placements.length) {
      config.set(PLACEMENT_INDEX, index);
      config.set(PLACEMENTS_ARRAY, placements);
      config.set(SEGMENT, $data.get(SEGMENT));
      config.set(WORD, $data.get(WORD));
      return new Placement(config);
    }
    
    let word = this.word.getNext();
    if (word) {
      config.set(SEGMENT, $data.get(SEGMENT));
      config.set(WORD, word);
      return new Placement(config).init();
    }
    
    let segment = this.segment.getNext();
    if (!segment) {
      return false;
    }
    
    const wordConfig = new Map();
    wordConfig.set(BLACKLIST, blacklist);
    wordConfig.set(SEGMENT, segment);
    wordConfig.set(TRAY, tray);
    word = createWord(wordConfig);
    while (!word) {
      segment = segment.getNext();
      if (segment) {
        wordConfig.set(SEGMENT, segment);
        word = createWord(wordConfig);
      } else {
        return false;
      }
    }
    config.set(SEGMENT, segment);
    config.set(WORD, word);
    return new Placement(config).init();
  }

  getPlacedTiles() {
    const $data = this.data;
    return $data.get(PLACEMENTS_ARRAY)[$data.get(PLACEMENT_INDEX)].get(TILES_ARRAY);
  }

  init() {
    // TODO: maps & symbols
    // TODO: abstract out to ../util/getPlacements
    
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
    return this;
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
  
  const placementConfig = new Map();
  placementConfig.set(BLACKLIST, config.get(BLACKLIST));
  placementConfig.set(BOARD, config.get(BOARD));
  placementConfig.set(SEGMENT, segment);
  placementConfig.set(TRAY, config.get(TRAY));
  placementConfig.set(WORD, word);
  return new Placement(placementConfig).init();
};
