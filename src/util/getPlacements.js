import { SEGMENT, WORD } from "./symbols";
import { isAWord } from "./trie";

export default (config) => {
  const segment = config.get(SEGMENT);
  const word = config.get(WORD);
  
  // TODO: START HERE
  
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
  return placements;
};
