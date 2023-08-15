const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

let questions_data = [];
let answeredCorrectly = [];
let currentQuestionIndex = 0;
let userScore = 0;

const questionsDir = path.join(__dirname, 'questions');
fs.readdir(questionsDir, (err, files) => {
    if (err) throw err;
    
    files.forEach(file => {
        if (path.extname(file) === '.json') {
            const filePath = path.join(questionsDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const parsedData = JSON.parse(fileContent);
            questions_data = questions_data.concat(parsedData);
        }
    });
});

let currentQuestionIndex = 0;
let userScore = 0;
let answeredCorrectly = [];

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

    // Check if the answer is correct and hasn't been answered correctly before
    if (req.body.submit === "Submit Answer" && selected_answer === correct_answer && !answeredCorrectly.includes(currentQuestionIndex)) {
        message = "Correct!";
        userScore += 1;
        answeredCorrectly.push(currentQuestionIndex); // Mark this question as answered correctly
    } else if (req.body.submit === "Submit Answer") {
        message = "Incorrect!";
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
