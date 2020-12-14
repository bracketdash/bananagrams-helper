// Instantiated:
// -- once per solve (each time the user changes the tray or blacklist)
// -- whenever we make a placement on the board (once per state)

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
    const rows = new Map();
    let newRow = placement.row;
    let newCol = placement.col;
    let numCols = this.numCols;
    let rowsToAdd = 0;
    let colsToAdd = 0;
    if (placement.row < 0) {
      rowsToAdd = -placement.row;
      newRow = 0;
    }
    if (placement.col < 0) {
      colsToAdd = -placement.col;
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
    if (placement.down) {
      placement.word.split("").forEach((letter, index) => {
        const newRowPlusIndex = newRow + index;
        if (!rows.has(newRowPlusIndex)) {
          rows.set(newRowPlusIndex, new Map());
        }
        const tileRow = rows.get(newRowPlusIndex);
        const originalValue = tileRow.get(newCol);
        tileRow.set(newCol, letter);
      });
    } else {
      const tileRow = rows.get(newRow);
      placement.word.split("").forEach((letter, index) => {
        const colPlusIndex = newCol + index;
        const originalValue = tileRow.get(colPlusIndex);
        tileRow.set(colPlusIndex, letter);
      });
    }
    const numRows = Math.max(...rows.keys()) + 1;
    return new Board({ numCols, numRows, rows });
  }
}

export const createBoard = (config) => new Board(config);
