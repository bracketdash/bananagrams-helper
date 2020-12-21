import getLetterCounts from "../util/getLetterCounts";

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

export default (str) => new Tray(str);
