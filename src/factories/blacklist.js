class Blacklist {
  constructor(blacklistStr) {
    this.words = new Set(blacklistStr.split(/\s*,\s*/));
  }
  
  allows(word) {
    return !this.words.has(word);
  }
}

export default (blacklistStr) => new Blacklist(blacklistStr);
