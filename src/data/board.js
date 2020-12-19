import { COLUMN_INDEX, IS_DOWN, NUMBER_OF_COLUMNS, NUMBER_OF_ROWS, ROW_INDEX, ROWS, WORD_ARRAY } from "../util/symbols";

class Board {
  constructor(config) {
    if (config) {
      this.data = config;
    } else {
      const $data = new Map();
      $data.set(NUMBER_OF_COLUMNS, 1);
      $data.set(NUMBER_OF_ROWS, 1);
      $data.set(ROWS, new Map([[0, new Map([[0, " "]])]]));
      this.data = $data;
    }
  }

  getArray() {
    const $data = this.data;
    return [...Array($data.get(NUMBER_OF_ROWS)).keys()].map((rowIndex) => {
      const row = $data.get(ROWS).get(rowIndex);
      const columns = Array($data.get(NUMBER_OF_COLUMNS)).fill(" ");
      if (row) {
        row.forEach((col, colIndex) => {
          columns[colIndex] = col;
        });
      }
      return columns;
    });
  }

  getNext(delta) {
    const $data = this.data;
    const rows = new Map();
    let newRow = delta.get(ROW_INDEX);
    let newCol = delta.get(COLUMN_INDEX);
    let numCols = $data.get(NUMBER_OF_COLUMNS);
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
    $data.get(ROWS).forEach((rowCols, rowKey) => {
      const cols = new Map();
      rowCols.forEach((col, colKey) => {
        if (colsToAdd + colKey + 1 > numCols) {
          numCols = colsToAdd + colKey + 1;
        }
        cols.set(colsToAdd + colKey, col);
      });
      rows.set(rowsToAdd + rowKey, cols);
    });
    if (delta.get(IS_DOWN)) {
      delta.get(WORD_ARRAY).forEach((letter, index) => {
        const newRowPlusIndex = newRow + index;
        if (!rows.has(newRowPlusIndex)) {
          rows.set(newRowPlusIndex, new Map());
        }
        const tileRow = rows.get(newRowPlusIndex);
        tileRow.set(newCol, letter);
      });
    } else {
      const tileRow = rows.get(newRow);
      delta.get(WORD_ARRAY).forEach((letter, index) => {
        const colPlusIndex = newCol + index;
        tileRow.set(colPlusIndex, letter);
      });
    }
    const numRows = Math.max(...rows.keys()) + 1;
    const config = new Map();
    cofig.set(NUMBER_OF_COLUMNS, numCols);
    cofig.set(NUMBER_OF_ROWS, numRows);
    cofig.set(ROWS, rows);
    return new Board(config);
  }
}

export default (config) => new Board(config);
