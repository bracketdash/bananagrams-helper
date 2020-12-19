export default (str) =>
  str.split("").reduce((counts, letter) => {
    counts.set(letter, counts.has(letter) ? counts.get(letter) + 1 : 1);
    return counts;
  }, new Map());
