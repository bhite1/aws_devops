const express = require('express');
const app = express();
const fs = require('fs');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

let questionBank = JSON.parse(fs.readFileSync('question-bank.json', 'utf-8'));
let currentQuestion = 0;
let score = 0;

app.get('/', (req, res) => {
    res.render('index', { 
        question: questionBank[currentQuestion].question, 
        choices: questionBank[currentQuestion].choices, 
        score: score 
    });
});

app.post('/', (req, res) => {
    let answer = req.body.answer;
    if(answer === questionBank[currentQuestion].answer) {
        score++;
    }
    currentQuestion++;
    if(currentQuestion === questionBank.length) {
        res.render('end', { score: score, total: questionBank.length });
    } else {
        res.redirect('/');
    }
});

app.listen(3000, () => console.log('Listening on port 3000'));
