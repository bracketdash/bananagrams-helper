// SHARED RESOURCES

const byLetterCount = new Map();
const byWordLength = new Map();
const wordlistSet = new Set();
const wordSymbols = new Map();

/* * * * * * * * * *
 * INITIALIZATION  *
 * * * * * * * * * */

const codes = new Map("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((c, n) => [c, n]));
const pattern = new RegExp("([0-9A-Z]+):([0-9A-Z]+)");
const syms = new Map();

let byLetter;
let newSofar;
let nextIndex;
let node;
let nodes;
let numSyms;
let part;
let ref;

fetch("/words.txt").then(async (response) => {
  postMessage({ message: "Unpacking word list..." });
  nodes = (await response.text()).split(";");
  nodes.some((node) => {
    const symParts = pattern.exec(node);
    if (!symParts) {
      return true;
    }
    syms.set(symParts[1], decode(symParts[2]));
    return false;
  });
  numSyms = syms.size;
  nodes = nodes.slice(numSyms);
  processNode(0, "");
  postMessage({ message: "Building caches..." });
  byLetterCount.forEach((instanceMap) => {
    const sumSet = new Set();
    [...instanceMap.keys()].sort().forEach((key) => {
      const wordSet = instanceMap.get(key);
      wordSet.forEach((wordSymbol) => {
        sumSet.add(wordSymbol);
      });
      sumSet.forEach((wordSymbol) => {
        if (!wordSet.has(wordSymbol)) {
          wordSet.add(wordSymbol);
        }
      });
    });
  });
  postMessage({ ready: true });
});

// INITIALIZATION FUNCTIONS

const decode = (code) => {
  if (codes.has(code)) {
    return codes.get(code);
  }
  const base = 36;
  const codeLength = code.length;
  let num = 0;
  let places = 1;
  let pow = 1;
  let range = base;
  while (places < codeLength) {
    num += range;
    places++;
    range *= base;
  }
  for (let i = codeLength - 1; i >= 0; i--) {
    let d = code.charCodeAt(i) - 48;
    if (d > 10) {
      d -= 7;
    }
    num += d * pow;
    pow *= base;
  }
  codes.set(code, num);
  return num;
};

const processNode = (index, sofar) => {
  node = nodes[index];
  let matches;
  if (node[0] === "!") {
    processWord(sofar);
    matches = node.slice(1).split(/([A-Z0-9,]+)/g);
  } else {
    matches = node.split(/([A-Z0-9,]+)/g);
  }
  const matchesLength = matches.length;
  for (let i = 0; i < matchesLength; i += 2) {
    part = matches[i];
    if (!part) {
      continue;
    }
    newSofar = sofar + part;
    ref = matches[i + 1];
    if (ref === "," || ref === undefined) {
      processWord(newSofar);
      continue;
    }
    nextIndex = syms.has(ref) ? syms.get(ref) : index + decode(ref) + 1 - numSyms;
    processNode(nextIndex, newSofar);
  }
};

const processWord = (wordStr) => {
  const wordArr = wordStr.split("");
  const wordSymbol = Symbol(wordStr);
  wordArr
    .reduce((counts, letter) => {
      counts.set(letter, counts.has(letter) ? counts.get(letter) + 1 : 1);
      return counts;
    }, new Map())
    .forEach((instances, letter) => {
      if (!byLetterCount.has(letter)) {
        byLetterCount.set(letter, new Map());
      }
      byLetter = byLetterCount.get(letter);
      if (!byLetter.has(instances)) {
        byLetter.set(instances, new Set());
      }
      byLetter.get(instances).add(wordSymbol);
    });
  wordlistSet.add(wordStr);
  wordSymbols.set(wordSymbol, { wordStr, wordArr });
};

/* * * * * *
 * SOLVER  *
 * * * * * */

const comboCache = new Map();

let currSolveTimestamp;

onmessage = function ({ data }) {
  new Solve(new Set(data.blacklistStr.split(",")), new Tray(data.trayStr), new Date().getTime()).init();
};

// SOLVER FUNCTIONS

const createPlacement = (board, blacklist, tray) => {
  const segment = new Segment(board.getArray()).init();
  if (!segment) {
    return false;
  }
  const word = new Word(blacklist, segment, tray).init();
  if (!word) {
    return false;
  }
  return new Placement(board, blacklist, tray, segment, word).init();
};

const getLetterCounts = (str) =>
  str.split("").reduce((counts, letter) => {
    counts.set(letter, counts.has(letter) ? counts.get(letter) + 1 : 1);
    return counts;
  }, new Map());

const getPatterns = (tiles) => {
  const fullPattern = `.*${tiles.replace(/\s+/g, (m) => `.{${m.length}}`)}.*`;
  const moddedPatternTest = /[a-z]+[^a-z]+[a-z]+/;
  const loop = (fullPattern, patterns, leftTrim, rightTrim, tilesLeftTrim) => {
    const oldTileLength = tiles.length;
    let allDone = false;
    let needsLeftTrimIteration = false;
    let moddedPattern = fullPattern;
    [...Array(leftTrim).keys()].forEach(() => {
      if (moddedPatternTest.test(moddedPattern)) {
        moddedPattern = moddedPattern.replace(/^[^a-z]*[a-z]+/, "");
        moddedPattern = moddedPattern.replace(/^\.\{([0-9]*)\}/, function (_, captured) {
          const num = parseInt(captured);
          if (num < 2) {
            return "";
          }
          return ".{0," + (num - 1) + "}";
        });
      } else {
        allDone = true;
      }
    });
    [...Array(rightTrim).keys()].forEach(() => {
      if (moddedPatternTest.test(moddedPattern)) {
        moddedPattern = moddedPattern.replace(/[a-z]+[^a-z]*$/, "");
        moddedPattern = moddedPattern.replace(/\.\{([0-9]*)\}$/, function (_, captured) {
          const num = parseInt(captured);
          if (num < 2) {
            return "";
          }
          return ".{0," + (num - 1) + "}";
        });
      } else {
        needsLeftTrimIteration = true;
      }
    });
    if (leftTrim > 0) {
      moddedPattern = "^" + moddedPattern;
    }
    if (rightTrim > 0) {
      moddedPattern = moddedPattern + "$";
    }
    if (allDone) {
      return patterns;
    }
    tilesLeftTrim += oldTileLength - tiles.length;
    if (needsLeftTrimIteration) {
      return loop(fullPattern, patterns, leftTrim + 1, 0, tiles, tilesLeftTrim);
    } else {
      patterns.push({
        tilesLeftTrim,
        pattern: moddedPattern,
      });
    }
    return loop(fullPattern, patterns, leftTrim, rightTrim + 1, tiles, tilesLeftTrim);
  };
  return loop(fullPattern, [fullPattern], 0, 1, tiles, 0);
};

const getPlacements = (segment, word) => {
  const placements = [];

  const segmentData = segment.getData();
  const { down, pattern, perps } = segmentData;
  let { col, row } = segmentData;

  const wordArr = word.getArray();
  const wordStr = word.getString();
  const maxIndex = wordStr.length - 1;

  let index = 0;
  let lastIndex;
  let start;

  while (index > -1 && index < maxIndex) {
    lastIndex = index;
    index = wordStr.slice(index).search(pattern);
    if (index === -1) {
      continue;
    }

    start = (down ? row : col) - index;
    if (
      wordArr.some((letter, letterIndex) => {
        const perpIndex = start + letterIndex;
        if (perps.has(perpIndex)) {
          const { left, right } = perps.get(perpIndex);
          if (!isAWord(`${left || ""}${letter}${right || ""}`)) {
            return true;
          }
        }
        return false;
      })
    ) {
      index = lastIndex + (index || 1);
      continue;
    } else if (down) {
      col = col + start;
    } else {
      row = row + start;
    }

    let tiles = wordStr;
    segment.getCounts().forEach((count, letter) => {
      [...Array(count).keys()].forEach(() => {
        tiles = tiles.replace(letter, "");
      });
    });

    placements.push({ col, down, row, tilesArr: tiles.split(""), wordArr });

    index = lastIndex + (index || 1);
  }
  return placements;
};

const getSegments = (str, index, down, segments, lines) => {
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

const getWordsForSegment = (blacklist, counts, pattern) => {
  if (counts.size === 1 && [...counts.values()][0] < 2) {
    return new Map();
  }
  const alphaKey = [...counts]
    .reduce((str, [letter, count]) => {
      str += letter.repeat(count);
      return str;
    }, "")
    .split("")
    .sort()
    .join("");
  if (!comboCache.has(alphaKey)) {
    const entry = new Set();
    // TODO:
    // clone the word length set as a starting point?
    // create word length sets during startup
    // each word length set should represent all words that are UP TO that length
    counts.forEach((count, letter) => {
      const wordsByLetterCount = byLetterCount.get(letter).get(count);
      // TODO: make sure this is the right/best logic...
      // maybe dynamically figure out which starting point would be best?
      // maybe change the sets in byLetterCount or byLength to help with whatever strategy we go with?
      entry.forEach((wordSymbol) => {
        if (!wordsByLetterCount.has(wordSymbol)) {
          entry.delete(wordSymbol);
        }
      });
    });
    // TODO: order words by length so the longest words are tried first
    const wordMap = new Map();
    entry.forEach((wordSymbol) => {
      const { wordArr, wordStr } = wordSymbols.get(wordSymbol);
      wordMap.set(wordStr, wordArr);
    });
    comboCache.set(alphaKey, wordMap);
  }
  const wordMap = comboCache.get(alphaKey);
  blacklist.forEach((wordStr) => {
    if (wordMap.has(wordStr)) {
      wordMap.delete(wordStr);
    }
  });
  const words = new Map();
  let wordIndex = 0;
  wordMap.forEach((wordArr, wordStr) => {
    if (pattern.test(wordStr)) {
      words.set(wordIndex, { wordArr, wordStr });
      wordIndex++;
    }
  });
  return words;
};

// SOLVER CLASSES

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

class Placement {
  constructor(board, blacklist, tray, segment, word) {
    this.board = board;
    this.blacklist = blacklist;
    this.tray = tray;
    this.segment = segment;
    this.word = word;
  }

  getDelta() {
    return this.placements[this.index];
  }

  getNext() {
    const blacklist = this.blacklist;
    const board = this.board;
    const index = this.index ? this.index + 1 : 1;
    const placements = this.placements || [];
    const tray = this.tray;

    if (index < placements.length) {
      return new Placement(board, blacklist, tray, this.segment, this.word, placements, index);
    }

    let word = this.word.getNext();
    if (word) {
      return new Placement(board, blacklist, tray, this.segment, word, placements, index).init();
    }

    let segment = this.segment.getNext();
    if (!segment) {
      return false;
    }

    word = new Word(blacklist, segment, tray).init();
    while (!word) {
      segment = segment.getNext();
      if (segment) {
        word = new Word(blacklist, segment, tray).init();
      } else {
        return false;
      }
    }

    return new Placement(board, blacklist, tray, segment, word, placements, index).init();
  }

  getPlacedTiles() {
    return this.placements[this.index].tilesArr;
  }

  init() {
    const placements = getPlacements(this.segment, this.word);
    if (!placements.length) {
      return false;
    }
    this.index = 0;
    this.placements = placements;
    return this;
  }
}

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
          down: false,
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

class Solve {
  constructor(blacklist, tray, timestamp) {
    currSolveTimestamp = timestamp;
    this.blacklist = blacklist;
    this.timestamp = timestamp;
    this.tray = tray;
  }

  handleUpdate(state, message) {
    postMessage({
      boardArr: state.getBoard().getArray(),
      message,
      remainingTray: state.getTray().getString(),
    });
  }

  init() {
    this.step(new State(this.blacklist, new Board(), this.tray));
  }

  step(state) {
    if (this.timestamp !== currSolveTimestamp) {
      return;
    }
    if (state.isSolved()) {
      this.handleUpdate(state, "Solution found!");
      return;
    }
    if (!this.tryNextStep(state.getNext(), "Trying next state...")) {
      if (!this.tryNextStep(state.getAdvanced(), "Advancing state...")) {
        let prevState = state.getPrev();
        while (prevState) {
          if (this.tryNextStep(prevState.getNext(), "Trying previous next state...")) {
            return;
          }
          prevState = prevState.getPrev();
        }
        this.handleUpdate(state, "No solutions possible!");
      }
    }
  }

  tryNextStep(state, message) {
    if (state) {
      this.handleUpdate(state, message);
      setTimeout(() => this.step(state));
      return true;
    }
    return false;
  }
}

class State {
  constructor(blacklist, board, tray, parent, placement) {
    this.blacklist = blacklist;
    this.board = board;
    this.tray = tray;
    this.parent = parent;
    this.placement = placement;
  }

  getAdvanced() {
    const placement = createPlacement(this.board, this.blacklist, this.tray);
    if (!placement) {
      return false;
    }
    return new State(this.blacklist, this.board.getNext(placement.getDelta()), this.tray.getNext(placement.getPlacedTiles()), this, placement);
  }

  getBoard() {
    return this.board;
  }

  getNext() {
    if (!this.parent) {
      return false;
    }
    const placement = this.parent.getPlacement().getNext();
    if (!placement) {
      return false;
    }
    return new State(this.blacklist, this.board.getNext(placement.getDelta()), this.tray.getNext(placement.getPlacedTiles()), this, placement);
  }

  getPlacement() {
    return this.placement || false;
  }

  getPrev() {
    return this.parent || false;
  }

  getTray() {
    return this.tray;
  }

  isSolved() {
    return this.tray.isEmpty();
  }
}

class Tray {
  constructor(trayStr) {
    this.trayStr = trayStr;
    this.letterCounts = getLetterCounts(trayStr);
  }

  getCountsWith(segmentCounts) {
    const $counts = this.letterCounts;
    const counts = new Map();
    $counts.forEach((count, letter) => {
      counts.set(letter, count);
    });
    segmentCounts.forEach((count, letter) => {
      counts.set(letter, $counts.has(letter) ? $counts.get(letter) + count : count);
    });
    return counts;
  }

  getNext(tilesToRemove) {
    let newTrayStr = this.trayStr;
    tilesToRemove.forEach((tileToRemove) => {
      newTrayStr = newTrayStr.replace(tileToRemove, "");
    });
    return new Tray(newTrayStr);
  }

  getString() {
    return this.trayStr;
  }

  isEmpty() {
    return this.trayStr === "";
  }
}

class Word {
  constructor(blacklist, segment, tray, words, index) {
    this.blacklist = blacklist;
    this.segment = segment;
    this.tray = tray;
    this.words = words;
    this.index = index;
  }

  getArray() {
    return this.words.get(this.index).wordArr;
  }

  getNext() {
    const indexPlusOne = this.index + 1;
    const words = this.words;
    if (words.size < indexPlusOne) {
      return false;
    }
    return new Word(this.blacklist, this.segment, this.tray, words, indexPlusOne);
  }

  getString() {
    return this.words.get(this.index).wordStr;
  }

  init() {
    const { blacklist, segment, tray } = this;
    const words = getWordsForSegment(blacklist, tray.getCountsWith(segment.getCounts()), segment.getPattern());
    if (!words.size) {
      return false;
    }
    this.index = 0;
    this.words = words;
    return this;
  }
}