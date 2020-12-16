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
    // TODO: return new Segment({ index, segments, state: this.state });
  }
  init() {
    const board = this.state.getBoard();
    // TODO: set this.index, this.segments [{ col, counts, down, pattern, perps, row }]
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
  }
}

export const createSegment = ({ state }) => {
  const segment = new Segment({ state });
  if (!segment.init()) {
    return false;
  }
  return segment;
};
