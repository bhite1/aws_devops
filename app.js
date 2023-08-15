const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

let questions_data = [];
fs.readFile('question-bank.json', 'utf8', (err, data) => {
    if (err) throw err;
    questions_data = JSON.parse(data);
});

let currentQuestionIndex = 0;
let userScore = 0;

app.get('/', (req, res) => {
    res.render('quiz', {
        question: questions_data[currentQuestionIndex],
        questionNumber: currentQuestionIndex + 1,
        totalQuestions: questions_data.length,
        userScore: userScore,
        selected_answer: "",
        message: '',
        explanation: ''
    });
});

app.post('/', (req, res) => {
    const selected_answer = req.body.answer;
    const correct_answer = questions_data[currentQuestionIndex].answer;

    let message = '';
    if (req.body.submit === "Submit Answer") {
        message = selected_answer === correct_answer ? "Correct!" : "Incorrect!";
        if (selected_answer === correct_answer) userScore += 1;
    }

    let explanation = req.body.submit === "Submit Answer" ? questions_data[currentQuestionIndex].explanation : '';

    if (req.body.submit === "Next") {
        currentQuestionIndex = (currentQuestionIndex + 1) % questions_data.length;
        message = '';
        explanation = '';
    }

    res.render('quiz', {
        question: questions_data[currentQuestionIndex],
        questionNumber: currentQuestionIndex + 1,
        totalQuestions: questions_data.length,
        userScore: userScore,
        selected_answer: selected_answer,
        message: message,
        explanation: explanation
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
