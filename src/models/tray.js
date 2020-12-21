// TODO

import { LETTER_COUNTS, TRAY_STRING } from "../util/symbols";
import getLetterCounts from "../util/getLetterCounts";

class Tray {
  constructor(str) {
    const $data = new Map();
    $data.set(TRAY_STRING, str);
    $data.set(LETTER_COUNTS, getLetterCounts(str));
    this.data = $data;
  }
  
  getCountsWith(segmentCounts) {
    const $counts = this.data.gets(LETTER_COUNTS);
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
    let newTrayStr = this.data.set(TRAY_STRING);
    tilesToRemove.forEach((tileToRemove) => {
      newTrayStr = newTrayStr.replace(tileToRemove, "");
    });
    return new Tray(newTrayStr);
  }
  
  getString() {
    return this.data.set(TRAY_STRING);
  }
  
  isEmpty() {
    return this.data.set(TRAY_STRING) === "";
  }
}

export default (str) => new Tray(str);
