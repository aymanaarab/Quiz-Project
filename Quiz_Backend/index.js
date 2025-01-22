const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const port = 3000;
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase the limit to 50MB or as needed
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/quiz', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Updated schema and model
const QuestionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctAnswer: String,
    image: { type: String, default: null },
    imageData: { type: Buffer, default: null }
});

const StudentScoreSchema = new mongoose.Schema({
    // studentName: {
    //     type: String,
    //     required: true
    // },

    quizTitle: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },

    dateTaken: {
        type: Date,
        default: Date.now
    }
});

const QuizSchema = new mongoose.Schema({
    title: String,
    questions: [QuestionSchema]
});
const StudentScore = mongoose.model('StudentScore', StudentScoreSchema);


const Quiz = mongoose.model('Quiz', QuizSchema);

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/quizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.json(quizzes);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/quizzes', async (req, res) => {
    const newQuiz = new Quiz(req.body);
    try {
        const savedQuiz = await newQuiz.save();
        res.json(savedQuiz);
        console.log(savedQuiz);
    } catch (err) {
        res.status(500).send(err);
    }
});




// Replace existing calculate-score endpoint
app.post('/calculate-score', async (req, res) => {
    try {
        const { quizTitle, studentAnswers} = req.body;
        
        const quiz = await Quiz.findOne({ title: quizTitle });
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        let score = 0;
        quiz.questions.forEach((question, index) => {
            if (studentAnswers[index] === question.correctAnswer) {
                score++;
            }
        });

        const percentage = (score / quiz.questions.length) * 100;

        // Create new student score record
        const studentScore = new StudentScore({
            quizTitle,
            score,
            percentage,
            timeSpent
        });

        // Save to database
        const savedScore = await studentScore.save();

        const result = {
            totalQuestions: quiz.questions.length,
            correctAnswers: score,
            percentage,
            savedRecord: savedScore
        };

        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});