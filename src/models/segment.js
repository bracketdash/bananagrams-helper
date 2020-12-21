import getSegments from "../util/getSegments";

class Segment {
  constructor(boardArr, segments, index) {
    this.boardArr = boardArr;
    this.index = index || 0;
    this.segments = segments;
  }

  getCounts() {
    return this.segments[this.index].counts;
  }

  getData() {
    return this.segments[this.index];
  }

  getNext() {
    const { boardArr, index, segments } = this;
    if (index === segments.length - 1) {
      return false;
    }
    return new Segment(boardArr, segments, index + 1);
  }

  getPattern() {
    return this.segments[this.index].pattern;
  }

  init() {
    const boardArr = this.boardArr;
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
      return this;
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
    rows.forEach((rowStr, rowIndex) => {
      getSegments(rowStr, rowIndex, false, segments, columns);
    });
    columns.forEach((colStr, colIndex) => {
      getSegments(colStr, colIndex, true, segments, rows);
    });
    if (!segments.length) {
      return false;
    }
    this.segments = segments;
    return this;
  }
}

export default (boardArr) => {
  return new Segment(boardArr).init();
};
