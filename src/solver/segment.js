import { getLetterCounts, getPatterns } from "./utilities";

class Segment {
  constructor({ index, segments, state }) {
    this.index = index;
    this.segments = segments;
    this.state = state;
  }
  allows(word) {
    return this.segments[this.index].pattern.test(word);
  }
  getCounts() {
    return this.segments[this.index].counts;
  }
  getData() {
    return this.segments[this.index];
  }
  getNext() {
    const { index, segments, state } = this;
    if (index === segments.length - 1) {
      return false;
    }
    return new Segment({ index: index + 1, segments, state });
  }
  init() {
    this.index = 0;
    const boardArr = this.state.getBoard().getArray();
    if (boardArr.length === 1 && boardArr[0].length === 1) {
      this.segments = [
        {
          col: 0,
          counts: new Map(),
          down: true,
          pattern: /.*/,
          perps: new Map(),
          row: 0,
        },
      ];
      return true;
    }
    const segments = [];
    const columns = [];
    const rows = boardArr.map((cols, row) => {
      cols.forEach((cell, col) => {
        if (!columns[col]) {
          columns.push("");
        }
        columns[col] += cell;
      });
      return cols.join("");
    });
    const produceSegments = (str, index, down) => {
      const trimmedLeft = str.trimLeft();
      const trimmed = trimmedLeft.trimRight();
      const inLeft = str.length - trimmedLeft.length;
      const counts = getLetterCounts(trimmed.replace(/\s+/g, ""));
      const perps = new Map();
      [...Array(str.length).keys()].forEach((perpIndex) => {
        const wholePerp = down ? rows[perpIndex] : columns[perpIndex];
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
    rows.forEach((rowStr, rowIndex) => {
      produceSegments(rowStr, rowIndex, false);
    });
    columns.forEach((colStr, colIndex) => {
      produceSegments(colStr, colIndex, true);
    });
    if (!segments.length) {
      return false;
    }
    this.segments = segments;
  }
}

export const createSegment = ({ state }) => {
  const segment = new Segment({ state });
  if (!segment.init()) {
    return false;
  }
  return segment;
};
