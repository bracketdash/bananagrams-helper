import { COLUMN_INDEX, IS_DOWN, NUMBER_OF_COLUMNS, NUMBER_OF_ROWS, ROW_INDEX, ROWS, WORD_ARRAY } from "./symbols";

class Board {
  constructor(config) {
    this.data = new Map();
    this.data.set(NUMBER_OF_COLUMNS, config.get(NUMBER_OF_COLUMNS) || 1);
    this.data.set(NUMBER_OF_ROWS, config.get(NUMBER_OF_ROWS) || 1);
    this.data.set(ROWS, config.get(ROWS) || new Map([[0, new Map([[0, " "]])]]));
  }
  getArray() {
    return [...Array(this.data.get(NUMBER_OF_ROWS)).keys()].map((rowIndex) => {
      const row = this.data.get(ROWS).get(rowIndex);
      const columns = Array(this.data.get(NUMBER_OF_COLUMNS)).fill(" ");
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
    let newRow = placementDelta.get(ROW_INDEX);
    let newCol = placementDelta.get(COLUMN_INDEX);
    let numCols = this.data.get(NUMBER_OF_COLUMNS);
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
    this.data.get(ROWS).forEach((rowCols, rowKey) => {
      const cols = new Map();
      rowCols.forEach((col, colKey) => {
        if (colsToAdd + colKey + 1 > numCols) {
          numCols = colsToAdd + colKey + 1;
        }
        cols.set(colsToAdd + colKey, col);
      });
      rows.set(rowsToAdd + rowKey, cols);
    });
    if (placementDelta.get(IS_DOWN)) {
      placementDelta..get(WORD_ARRAY).forEach((letter, index) => {
        const newRowPlusIndex = newRow + index;
        if (!rows.has(newRowPlusIndex)) {
          rows.set(newRowPlusIndex, new Map());
        }
        const tileRow = rows.get(newRowPlusIndex);
        tileRow.set(newCol, letter);
      });
    } else {
      const tileRow = rows.get(newRow);
      placementDelta.get(WORD_ARRAY).forEach((letter, index) => {
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

export const createBoard = (config) => new Board(config);
