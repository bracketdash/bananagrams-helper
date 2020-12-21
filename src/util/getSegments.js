import getLetterCounts from "../util/getLetterCounts";
import getPatterns from "../util/getPatterns";

export default (str, index, down, segments, lines) => {
  const trimmedLeft = str.trimLeft();
  const trimmed = trimmedLeft.trimRight();
  const inLeft = str.length - trimmedLeft.length;
  const counts = getLetterCounts(trimmed.replace(/\s+/g, ""));
  const perps = new Map();
  [...Array(str.length).keys()].forEach((perpIndex) => {
    const wholePerp = lines[perpIndex];
    const left = wholePerp.slice(0, index).split(/\s+/).pop();
    const right = wholePerp.slice(index + 1, 0).split(/\s+/)[0];
    if (!left.length && !right.length) {
      return;
    }
    perps.set(perpIndex, { left, right });
  });
  const startingSegment = { counts, down, perps };
  getPatterns(trimmed).forEach(({ tilesLeftTrim, pattern }) => {
    const start = tilesLeftTrim + inLeft;
    startingSegment.pattern = pattern;
    if (down) {
      segments.push(Object.assign({ col: index, row: start }, startingSegment));
    } else {
      segments.push(Object.assign({ col: start, row: index }, startingSegment));
    }
  });
};
