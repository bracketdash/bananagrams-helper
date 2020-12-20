import { SEGMENT, WORD } from "./symbols";
import { isAWord } from "./trie";

export default (config) => {
  const placements = [];
  
  const segment = config.get(SEGMENT);
  const segmentData = segment.getData();
  const down = segmentData.get(IS_DOWN);
  const perps = segmentData.get(PERPINDICULARS);
  let col = segmentData.get(COLUMN_INDEX);
  let row = segmentData.get(ROW_INDEX);
  
  const word = config.get(WORD);
  const wordArr = word.getArray();
  const wordStr = word.getString();
  
  let index = 0;
  let lastIndex;
  let start;
  
  while (index > -1 && index < wordStr.length - 1) {
    lastIndex = index;
    index = wordStr.slice(index).search(segmentData.get(PATTERN));
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
    segment.getCounts().forEach((count, letter) => {
      [...Array(count).keys()].forEach(() => {
        tiles = tiles.replace(letter, "");
      });
    });
    
    const placement = new Map();
    placement.set(COLUMN_INDEX, col);
    placement.set(IS_DOWN, down);
    placement.set(ROW_INDEX, row);
    placement.set(TILES_ARRAY, tiles.split(""));
    placement.set(WORD_ARRAY, wordArr);
    placements.push(placement);
    
    index = lastIndex + (index || 1);
  }
  return placements;
};
