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
    const segments = [];
    let columns = [];
    const rows = this.state.getBoard().getArray().map((cols, row) => {
      cols.forEach((cell, col) => {
        if (!columns[col]) {
          columns.push("");
        }
        columns[col] += cell;
      });
      return cols.join("");
    });
    rows.forEach((rowStr, rowIndex) => {
      // TODO: get tiles, then create one segment for each pattern we can make from them
    });
    columns.forEach((colStr, colIndex) => {
      // TODO: get tiles, then create one segment for each pattern we can make from them
    });
    /*
    getPatterns(tiles) {
      const fullPattern = `.*${tiles.replace(/\s+/g, (m) => `.{${m.length}}`)}.*`;
      const moddedPatternTest = /[a-z]+[^a-z]+[a-z]+/;
      const loop = (fullPattern, patterns, leftTrim, rightTrim) => {
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
        if (needsLeftTrimIteration) {
          return loop(fullPattern, patterns, leftTrim + 1, 0);
        } else {
          patterns.push(moddedPattern);
        }
        return loop(fullPattern, patterns, leftTrim, rightTrim + 1);
      };
      return new Promise(async (resolve) => {
        setTimeout(() => {
          resolve(new RegExp(loop(fullPattern, [fullPattern], 0, 1).join("|")));
        });
      });
    }
    */
    // TODO: segments.push({ col, counts, down, pattern, perps, row });
    if (!segments.length) {
      return false;
    }
    this.index = 0;
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
