const efrt = require("efrt");
const fs = require("fs");
const path = require("path");
// TODO: use a word list that only contains the most common english words
const wordListPath = require("word-list");

fs.writeFileSync(path.join(__dirname, "../src/assets/words.txt"), efrt.pack(fs.readFileSync(wordListPath, "utf8").split("\n")).slice(5));
