const express = require('express');
const solver = require('./solver.js');
const app = express();
app.get('/', function(req, res) {
    res.send('UI coming soon.');
});
app.get('/solve', function(req, res) {
    // TODO: BUG - /solve?letters=somemorelettersletters produces a strange solution with gaps on the board 
    let disallowedWords = false;
    if (!req.query.letters) {
        res.send('No letters. No solution.');
    }
    if (req.query.disallowedWords) {
        disallowedWords = req.query.disallowedWords.split(',');
    }
    solver.solve(req.query.letters, disallowedWords).then(function(answer) {
        res.setHeader('Content-Type', 'application/json');
        res.send(answer);
    });
});
app.listen(3000, () => console.log('App started successfully.'));
