import getLetterCounts from "../util/getLetterCounts";

class Tray {
  constructor(str) {
    this.str = str;
    this.counts = getLetterCounts(str);
  }
  getCountsWith(segment) {
    const counts = new Map();
    this.counts.forEach((count, letter) => {
      counts.set(letter, count);
    });
    segment.getCounts().forEach((count, letter) => {
      counts.set(letter, this.counts.has(letter) ? this.counts.get(letter) + count : count);
    });
    return counts;
  }
  getNext(tilesToRemove) {
    let newTrayStr = this.str;
    tilesToRemove.split("").forEach((tileToRemove) => {
      newTrayStr = newTrayStr.replace(tileToRemove, "");
    });
    return new Tray(newTrayStr);
  }
  getString() {
    return this.str;
  }
  isEmpty() {
    return !this.str;
  }
}

export default (str) => new Tray(str);
