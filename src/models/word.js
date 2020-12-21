import { getWordsForSegment } from "../services/trie";

class Word {
  constructor(config) {
    this.data = config;
  }

  getArray() {
    const $data = this.data;
    return $data.get(WORDS_MAP)[$data.get(WORD_INDEX)].get(WORD_ARRAY);
  }

  getNext() {
    const $data = this.data;
    if ($data.get(WORDS_MAP).size < $data.get(WORD_INDEX) + 1) {
      return false;
    }
    const wordConfig = new Map();
    wordConfig.set(BLACKLIST, $data.get(BLACKLIST));
    wordConfig.set(SEGMENT, $data.get(SEGMENT));
    wordConfig.set(TRAY, $data.get(TRAY));
    wordConfig.set(WORD_INDEX, $data.get(WORD_INDEX) + 1);
    wordConfig.set(WORDS_MAP, $data.get(WORDS_MAP));
    return new Word(wordConfig);
  }

  getString() {
    const $data = this.data;
    return $data.get(WORDS_MAP)[$data.get(WORD_INDEX)].get(WORD_STRING);
  }

  init() {
    const $data = this.data;
    const words = getWordsForSegment($data.get(BLACKLIST), $data.get(SEGMENT), $data.get(TRAY));
    if (!words.size) {
      return false;
    }
    const $data = this.data;
    $data.set(WORDS_MAP, words);
    $data.set(WORD_INDEX, 0);
    return this;
  }
}

export default (config) => {
  return new Word(config).init();
};
