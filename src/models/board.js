class Board {
  constructor(numColumns, numRows, rows) {
    this.numColumns = numColumns || 1;
    this.numRows = numRows || 1;
    this.rows = rows || new Map([[0, new Map([[0, " "]])]]);
  }

  getArray() {
    return [...Array(this.numRows).keys()].map((rowIndex) => {
      const row = this.rows.get(rowIndex);
      const columns = Array(this.numColumns).fill(" ");
      if (row) {
        row.forEach((col, colIndex) => {
          columns[colIndex] = col;
        });
      }
      return columns;
    });
  }

  getNext(delta) {
    const rows = new Map();
    let newRow = delta.row;
    let newCol = delta.col;
    let numCols = this.numColumns;
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
    if (delta.down) {
      delta.wordArr.forEach((letter, index) => {
        const newRowPlusIndex = newRow + index;
        if (!rows.has(newRowPlusIndex)) {
          rows.set(newRowPlusIndex, new Map());
        }
        const tileRow = rows.get(newRowPlusIndex);
        tileRow.set(newCol, letter);
      });
    } else {
      const tileRow = rows.get(newRow);
      delta.wordArr.forEach((letter, index) => {
        const colPlusIndex = newCol + index;
        tileRow.set(colPlusIndex, letter);
      });
    }
    return new Board(numCols, Math.max(...rows.keys()) + 1, rows);
  }
}

export default (numColumns, numRows, rows) => new Board(numColumns, numRows, rows);
