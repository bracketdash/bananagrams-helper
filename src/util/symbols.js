const labels = [
  "BLACKLIST_STRING",
  "BLACKLIST",
  "BRANCHES",
  "COLUMN_INDEX",
  "CURRENT_SOLVE",
  "FINISHES_WORD",
  "IS_DOWN",
  "NUMBER_OF_COLUMNS",
  "NUMBER_OF_ROWS",
  "PARENT_BRANCH",
  "READY",
  "ROW_INDEX",
  "ROWS",
  "TRAY_STRING",
  "TRAY",
  "UPDATE_DATA",
  "UPDATE_FUNCTION",
  "WORD_ARRAY",
];
const symbols = {};
labels.forEach((label) => {
  symbols[label] = Symbol(label);
});
export default symbols;
