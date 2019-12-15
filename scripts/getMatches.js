function getMatchesLoop(strip, stripdex, dir, letters, disallowedWords, trie) {
    return new Promise(function(resolve) {
        var notDir = dir === 'row' ? 'col' : 'row';
        var stripStr = strip.join('');
        var stripStrTrimmed = _.trim(stripStr);
        if (!stripStrTrimmed) {
            return [];
        }
        var pattern = new RegExp(stripStrTrimmed.replace(/\s/g, '.'));
        // TODO: BUG - this pattern ignores words that might only attach to one of the edge tiles in the strip
        var stripMatches = [];
        _.forEach(stripStrTrimmed.split(''), function(tileOnBoard, tileIndex) {
            if (tileOnBoard !== ' ') {
                makeWordsWith(letters + tileOnBoard, trie).then(function(wordsWithLetters) {
                    var words = wordsWithLetters;
                    if (disallowedWords) {
                        words = _.difference(words, disallowedWords);
                    }
                    _.forEach(words, function(word) {
                        if (pattern.test(word)) {
                            var stripMatch = {
                                word: word,
                                dir: dir
                            };
                            stripMatch[dir] = stripdex;
                            stripMatch[notDir] = stripStr.search(/[a-z]/) - word.search(pattern);
                            stripMatches.push(stripMatch);
                        }
                    });
                    if (tileIndex === stripStrTrimmed.length - 1) {
                        resolve(stripMatches);
                    }
                });
            }
        });
    });
}

function getMatches(letters, disallowedWords, board, trie) {
    return new Promise(function(resolve) {
        var matches = [];
        crawlBoard(board, function(boardRow, boardRowIndex) {
            getMatchesLoop(boardRow, boardRowIndex, 'row', letters, disallowedWords, trie).then(function(loopResults) {
                var rowMatches = _.filter(loopResults, function(match) {
                    if (isMatchValid(match, board)) {
                        return true;
                    }
                    return false;
                });
                if (rowMatches.length) {
                    matches = matches.concat(rowMatches);
                }
            });
        }, function(boardColumn, boardColumnIndex) {
            getMatchesLoop(boardColumn, boardColumnIndex, 'col', letters, disallowedWords, trie).then(function(loopResults) {
                var columnMatches = _.filter(loopResults, function(match) {
                    if (isMatchValid(match, board)) {
                        return true;
                    }
                    return false;
                });
                if (columnMatches.length) {
                    matches = matches.concat(columnMatches);
                }
                if (boardColumnIndex === board[0].length-1) {
                    resolve(matches);                    
                }
            });
        });
    });
}