class Board {
  constructor({ numCols, numRows, rows }) {
    this.numCols = numCols || 1;
    this.numRows = numRows || 1;
    this.rows = rows || new Map([[0, new Map([[0, " "]])]]);
  }
  getArray() {
    return [...Array(this.numRows).keys()].map((rowIndex) => {
      const row = this.board.get(rowIndex);
      const columns = Array(this.numCols).fill(" ");
      if (row) {
        row.forEach((col, colIndex) => {
          columns[colIndex] = col;
        });
      }
      return columns;
    });
  }
  getNext(placement) {
    const placementDelta = placement.getDelta();
    const rows = new Map();
    let newRow = placementDelta.row;
    let newCol = placementDelta.col;
    let numCols = this.numCols;
    let rowsToAdd = 0;
    let colsToAdd = 0;
    if (newRow < 0) {
      rowsToAdd = -newRow;
      newRow = 0;
    }
    if (newCol < 0) {
      colsToAdd = -newCol;
      newCol = 0;
    }
    this.rows.forEach((rowCols, rowKey) => {
      const cols = new Map();
      rowCols.forEach((col, colKey) => {
        if (colsToAdd + colKey + 1 > numCols) {
          numCols = colsToAdd + colKey + 1;
        }
        cols.set(colsToAdd + colKey, col);
      });
      rows.set(rowsToAdd + rowKey, cols);
    });
    if (placementDelta.down) {
      placementDelta.wordArr.forEach((letter, index) => {
        const newRowPlusIndex = newRow + index;
        if (!rows.has(newRowPlusIndex)) {
          rows.set(newRowPlusIndex, new Map());
        }
        const tileRow = rows.get(newRowPlusIndex);
        tileRow.set(newCol, letter);
      });
    } else {
      const tileRow = rows.get(newRow);
      placementDelta.wordArr.split("").forEach((letter, index) => {
        const colPlusIndex = newCol + index;
        tileRow.set(colPlusIndex, letter);
      });
    }
    const numRows = Math.max(...rows.keys()) + 1;
    return new Board({ numCols, numRows, rows });
  }
}

export const createBoard = (config) => new Board(config);
