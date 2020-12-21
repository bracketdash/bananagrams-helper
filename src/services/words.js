const trieWorker = new Worker("/modules/trie.js");

let wordlistSet;

export const downloadAndUnpackWords = () => {
  return new Promise((resolve) => {
    console.time("downloadAndUnpackWords");
    trieWorker.onmessage = ({ data }) => {
      wordlistSet = data;
      console.timeEnd("downloadAndUnpackWords");
      resolve();
    };
    trieWorker.postMessage({ action: "downloadAndUnpackWords" });
  });
};

export const getWordsForSegment = (blacklist, segment, tray) => {
  return new Promise((resolve) => {
    const counts = tray.getCountsWith(segment.getCounts());
    if (/* TODO: sum of tray and segment letters is less than 2 */) {
      resolve(new Map());
      return;
    }
    trieWorker.onmessage = ({ data }) => {
      resolve(data);
    };
    trieWorker.postMessage({
      action: "getWordsForSegment",
      blacklist,
      counts,
      pattern: segment.getPattern(),
    });
  });
};

export const isAWord = (word) => wordlistSet.has(word);
