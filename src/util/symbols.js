const labels = ["BRANCHES", "COLUMN_INDEX", "FINISHES_WORD", "IS_DOWN", "NUMBER_OF_COLUMNS", "NUMBER_OF_ROWS", "PARENT_BRANCH", "ROW_INDEX", "ROWS", "WORD_ARRAY"];
const symbols = {};
labels.forEach((label) => {
  symbols[label] = Symbol(label);
});
export default symbols;
