import { isAWord } from "../services/words";

export default (segment, word) => {
  const placements = [];

  const segmentData = segment.getData();
  const { down, pattern, perps } = segmentData;
  let { col, row } = segmentData;

  const wordArr = word.getArray();
  const wordStr = word.getString();
  const maxIndex = wordStr.length - 1;

  let index = 0;
  let lastIndex;
  let start;

  while (index > -1 && index < maxIndex) {
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
    segment.getCounts().forEach((count, letter) => {
      [...Array(count).keys()].forEach(() => {
        tiles = tiles.replace(letter, "");
      });
    });

    placements.push({ col, down, row, tilesArr: tiles.split(""), wordArr });

    index = lastIndex + (index || 1);
  }
  return placements;
};
