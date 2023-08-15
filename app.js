const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Read questions data from file
let questions_data = [];
fs.readFile('question-bank.json', 'utf8', (err, data) => {
    if (err) throw err;
    questions_data = JSON.parse(data);
});

app.get('/', (req, res) => {
    res.render('quiz', { question: questions_data[0], message: '', explanation: '' });
});

app.post('/', (req, res) => {
    const selected_answer = req.body.answer;
    const correct_answer = questions_data[0].answer;
    
    let message = selected_answer === correct_answer ? "Correct!" : "Incorrect!";
    let explanation = questions_data[0].explanation;
    
    res.render('quiz', { question: questions_data[0], message: message, explanation: explanation });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
