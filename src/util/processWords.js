import { LETTER_COUNTS, WORD_ARRAY, WORD_STRING } from "./symbols";
import getLetterCounts from "./getLetterCounts";

export default (wordlistSet) => {
  const byLetterCount = new Map();
  const wordSymbols = new Map();
  wordlistSet.forEach((word) => {
    const letterCounts = getLetterCounts(word);
    const wordData = new Map();
    const wordSymbol = Symbol(word);
    letterCounts.forEach((instances, letter) => {
      if (!byLetterCount.has(letter)) {
        byLetterCount.set(letter, new Map());
      }
      const instanceMap = byLetterCount.get(letter);
      [...Array(instances).keys()].forEach((index) => {
        const indexPlusOne = index + 1;
        if (!instanceMap.has(indexPlusOne)) {
          instanceMap.set(indexPlusOne, new Set());
        }
        instanceMap.get(indexPlusOne).add(wordSymbol);
      });
    });
    wordData.set(LETTER_COUNTS, letterCounts);
    wordData.set(WORD_ARRAY, word.split(""));
    wordData.set(WORD_STRING, word);
    wordSymbols.set(wordSymbol, wordData);
  });
  return { byLetterCount, wordSymbols };
};
