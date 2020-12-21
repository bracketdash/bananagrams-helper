import { getWordsForSegment } from "../services/words";

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

  async init() {
    const words = await getWordsForSegment(this.blacklist, this.segment, this.tray);
    if (!words.size) {
      return false;
    }
    this.index = 0;
    this.words = words;
    return this;
  }
}

export default async (blacklist, segment, tray) => {
  return await new Word(blacklist, segment, tray).init();
};
