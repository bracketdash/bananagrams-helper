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
    trieWorker.onmessage = ({ data }) => {
      resolve(data);
    };
    trieWorker.postMessage({
      action: "getWordsForSegment",
      blacklist,
      counts: tray.getCountsWith(segment.getCounts()),
      pattern: segment.getPattern(),
    });
  });
};

export const isAWord = (word) => wordlistSet.has(word);
