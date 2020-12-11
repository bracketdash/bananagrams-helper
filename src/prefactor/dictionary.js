import { createTrie } from "./trie";

/*
TODO
Can't just use `canBeMadeFromTray` how we're using it now
We need to allow for letters words would intersect on the board
Rearrange things so we get words for each segment instead of for the tray
Maybe repurpose the current `canBeMadeFromTray` to be a generic `canBeMadeFrom`
If that's the best route, cache that function the same way we do `fromAlphaCode` in trie.js
*/

const canBeMadeFromTray = (trayLetterCount, word) => {
  let remainder = word;
  while (remainder.length > 0) {
    const letter = remainder[0];
    let instances = 0;
    remainder = remainder.replaceAll(letter, () => {
      instances++;
      return "";
    });
    if (!trayLetterCount.has(letter) || trayLetterCount.get(letter) < instances) {
      return false;
    }
  }
  return true;
};

class Dictionary {
  constructor() {
    this.trie = createTrie();
    this.trie.downloadAndBuild().then(() => {
      this.readyCallback();
    });
  }
  
  getPossiblePlacements(tray, blacklist, segments) {
    // TODO: convert to a function that provides one possible placement at a time
    const placements = new Set();
    const trayLetterCount = tray.split("").reduce((counts, letter) => {
      counts.set(letter, counts.has(letter) ? counts.get(letter) + 1 : 1);
      return counts;
    }, new Map());
    // TODO: update this so we can get one word at a time
    this.trie.traverse({
      onFullWord: (word) => {
        if (!canBeMadeFromTray(trayLetterCount, word) || blacklist.has(word)) {
          return;
        }
        if (!segments.size) {
          placements.add({
            row: 0,
            col: 0,
            down: true,
            word,
          });
          return;
        }
        segments.forEach(({ row, col, down, tiles, patterns }) => {
          if (!patterns.test(word)) {
            return;
          }
          const firstPosition = -(word.length - 1);
          const wordLetters = word.split("");
          [...Array(word.length * 2 + tiles.length - 4).keys()].forEach((index) => {
            const pos = firstPosition + index;
            let overlap = false;
            let valid = true;
            wordLetters.forEach((letter, letterIndex) => {
              if (!valid) {
                return;
              }
              if (tiles[pos + letterIndex] !== " ") {
                if (tiles[pos + letterIndex] !== letter) {
                  valid = false;
                } else if (!overlap) {
                  overlap = true;
                }
              }
            });
            if (!valid || !overlap) {
              return;
            }
            let rowAdd = 0;
            let colAdd = 0;
            if (down) {
              rowAdd = pos;
            } else {
              colAdd = pos;
            }
            placements.add({
              row: row + rowAdd,
              col: col + colAdd,
              down,
              word,
            });
          });
        });
      },
      prefixGate: (prefix) => canBeMadeFromTray(trayLetterCount, prefix)
    });
    return placements;
  }
  
  isAWord(possibleWord) {
    let isAWord = false;
    this.trie.traverse({
      onFullWord: (word) => {
        if (word === possibleWord) {
          isAWord = true;
        }
      },
      prefixGate: (prefix) => possibleWord.startsWith(prefix)
    });
    return isAWord;
  }

  onReady(callback) {
    this.readyCallback = callback;
  }
}

export const createDictionary = () => new Dictionary();