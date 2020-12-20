import getNextWord from "../util/getNextWord";

class Word {
  constructor(config) {
    this.data = config;
  }

  getArray() {
    return this.data.get(WORD_ARRAY);
  }

  getNext() {
    const wordConfig = getNextWord(this);
    if (!wordConfig) {
      return false;
    }
    const $data = this.data;
    wordConfig.set(BLACKLIST, $data.get(BLACKLIST));
    wordConfig.set(SEGMENT, $data.get(SEGMENT));
    wordConfig.set(TRAY, $data.get(TRAY));
    wordConfig.set(WORD_ARRAY, wordConfig.get(WORD_STRING).split(""));
    return new Word(wordConfig);
  }

  getString() {
    return this.data.get(WORD_STRING);
  }

  init() {
    const wordConfig = getNextWord(this);
    if (!wordConfig) {
      return false;
    }
    const $data = this.data;
    $data.set(BRANCH, wordConfig.get(BRANCH));
    $data.set(PARTS, wordConfig.get(PARTS));
    $data.set(WORD_STRING, wordConfig.get(WORD_STRING));
    $data.set(WORD_ARRAY, wordConfig.get(WORD_STRING).split(""));
    return this;
  }

  partMeetsCriteria(part) {
    const $data = this.data;
    const counts = $data.get(TRAY).getCountsWith($data.get(SEGMENT).getCounts());
    while (part.length > 0) {
      const letter = part[0];
      let instances = 0;
      part = part.replaceAll(letter, () => {
        instances++;
        return "";
      });
      if (!counts.has(letter) || counts.get(letter) < instances) {
        return false;
      }
    }
    return true;
  }
}

export default (config) => {
  return new Word(config).init();
};
