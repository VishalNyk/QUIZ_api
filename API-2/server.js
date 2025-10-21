// server.js

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import questions from "./Questions.json" assert { type: "json" }; 

const app = express();
const PORT = 4000;


// efficient shuffling algorithm (similar to Fisher-Yates)
const getRandomSample = (arr, n) => {
    const shuffled = arr.slice(); 
    let i = arr.length;
    let temp, j;
    while (i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    return shuffled.slice(0, n);
};

app.use(cors());
app.use(bodyParser.json());

// --- API Endpoint: Get Random Questions for a Quiz Session ---
// Route: GET /api/quiz-session?count=N
// This is the primary endpoint for the frontend quiz component.
app.get('/api/quiz-session', (req, res) => {
    const countStr = req.query.count;
    const totalQuestions = questions.length;
    let count;
    if (!countStr) {
        return res.status(400).json({ 
            message: "Missing 'count' query parameter. Please specify the number of questions (e.g., /api/quiz-session?count=7)." 
        });
    }

    count = parseInt(countStr, 10);

    if (isNaN(count) || count <= 0) {
        return res.status(400).json({ 
            message: "Invalid 'count' parameter. Must be a positive integer." 
        });
    }
    if (count > totalQuestions) {
        return res.status(400).json({ 
            message: `Requested ${count} questions, but only ${totalQuestions} are available.` 
        });
    }
    const randomQuestions = getRandomSample(questions, count);
    console.log(`Request received for ${count} random questions from quiz-session endpoint.`);
    res.json(randomQuestions);
});

// API Endpoint to submit and calculate score
app.post('/api/quiz-submit', (req, res) => {
    const userAnswers = req.body;

    if (!Array.isArray(userAnswers) || userAnswers.length === 0) {
        return res.status(400).json({ 
            message: "Invalid submission format. Expected an array of answers." 
        });
    }

    let correctCount = 0;
    const totalQuestions = userAnswers.length;
    const detailedResults = [];

    // Map the master questions array for fast lookup by ID
    const questionMap = new Map(questions.map(q => [q.id, q]));

    for (const userAnswer of userAnswers) {
        const questionId = userAnswer.id;
        const selectedIndex = userAnswer.selectedOptionIndex;
        
        const masterQuestion = questionMap.get(questionId);

        // 1. Validate against master data
        if (!masterQuestion) {
            console.warn(`Attempted submission for non-existent question ID: ${questionId}`);
            continue; 
        }

        const isCorrect = (masterQuestion.correctOptionIndex === selectedIndex);
        
        if (isCorrect) {
            correctCount++;
        }

        // 2. Build detailed result for the frontend feedback
        detailedResults.push({
            id: questionId,
            question: masterQuestion.question,
            options: masterQuestion.options,
            isCorrect: isCorrect,
            userAnswerIndex: selectedIndex,
            correctAnswerIndex: masterQuestion.correctOptionIndex,
            explanation: masterQuestion.explanation || "No explanation provided."
        });
    }

    // 3. Final calculation and response object
    const scorePercentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    
    const response = {
        totalQuestions: totalQuestions,
        correctAnswers: correctCount,
        scorePercentage: parseFloat(scorePercentage.toFixed(2)),
        detailedResults: detailedResults
    };

    console.log(`Quiz submitted. Total questions: ${totalQuestions}, Correct: ${correctCount}, Score: ${response.scorePercentage}%`);
    res.json(response);
});


// API Endpoint: Get All Questions
app.get('/api/questions', (req, res) => {
    console.log('Request received for /api/questions (Full List)');
    res.json(questions);
});



app.listen(PORT, () => {
    console.log(`Server is running successfully on http://localhost:${PORT}`);
    console.log('API endpoint for random quiz session: http://localhost:3000/api/quiz-session?count=N');
});