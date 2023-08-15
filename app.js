const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

let questions_data = [];
let answeredCorrectly = [];
let userAnswers = [];  // To store user's selected answers
let currentQuestionIndex = 0;
let userScore = 0;

// Read all files in the 'questions' directory
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

app.get('/', (req, res) => {
    res.render('quiz', {
        question: questions_data[currentQuestionIndex],
        questionNumber: currentQuestionIndex + 1,
        totalQuestions: questions_data.length,
        userScore: userScore,
        selected_answer: userAnswers[currentQuestionIndex] || "",
        message: '',
        explanation: ''
    });
});

app.post('/', (req, res) => {
    const selected_answer = req.body.answer;
    const correct_answer = questions_data[currentQuestionIndex].answer;

    // Store the user's answer
    userAnswers[currentQuestionIndex] = selected_answer;

    let message = '';
    if (req.body.submit === "Submit Answer") {
        if (selected_answer === correct_answer) {
            message = "Correct!";
            if (!answeredCorrectly.includes(currentQuestionIndex)) {
                userScore += 1;
                answeredCorrectly.push(currentQuestionIndex);
            }
        } else {
            message = "Incorrect!";
        }
    }

    let explanation = req.body.submit === "Submit Answer" ? questions_data[currentQuestionIndex].explanation : '';

    if (req.body.submit === "Next") {
        currentQuestionIndex = (currentQuestionIndex + 1) % questions_data.length;
        message = '';
        explanation = '';
    } else if (req.body.submit === "Back") {
        currentQuestionIndex = (currentQuestionIndex - 1 + questions_data.length) % questions_data.length;
        message = '';
        explanation = '';
    }

    res.render('quiz', {
        question: questions_data[currentQuestionIndex],
        questionNumber: currentQuestionIndex + 1,
        totalQuestions: questions_data.length,
        userScore: userScore,
        selected_answer: userAnswers[currentQuestionIndex] || "",
        message: message,
        explanation: explanation
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
