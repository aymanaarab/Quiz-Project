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
    studentName: {
        type: String,
        required: true
    },

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

// Get all quizzes
app.get('/quizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.json(quizzes);
    } catch (err) {
        res.status(500).send(err);
    }
});
// ...existing code...


//  Get quiz by id
app.get('/quizzes/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.json(quiz);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new quiz
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
// Delete quiz by id and also delete associated student scores
app.delete('/quizzes/:id', async (req, res) => {
    try {
        const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
        
        if (!deletedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Also delete associated student scores
        await StudentScore.deleteMany({ quizTitle: deletedQuiz.title });

        res.json({ 
            message: 'Quiz and associated scores deleted successfully', 
            deletedQuiz 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




// Replace existing calculate-score endpoint
app.post('/calculate-score', async (req, res) => {
    try {
        const { studentName ,quizTitle, studentAnswers } = req.body;
        console.log(quizTitle, studentAnswers , studentName);
        if (!quizTitle || !Array.isArray(studentAnswers)) {
            return res.status(400).json({ 
                error: 'Invalid request format' 
            });
        }

        const quiz = await Quiz.findOne({ title: quizTitle });
        if (!quiz) {
            return res.status(404).json({ 
                error: 'Quiz not found' 
            });
        }
        console.log(quiz)

        let score = 0;
        quiz.questions.forEach((question, index) => {
            if (studentAnswers[index] === question.correctAnswer) {
                score++;
            }
        });

        const percentage = (score / quiz.questions.length) * 100;

        const studentScore = await new StudentScore({
            quizTitle,
            score,
            studentName , 
            percentage,
            dateTaken: new Date()
        }).save();

        res.json({
            totalQuestions: quiz.questions.length,
            correctAnswers: score,
            percentage,
            savedRecord: studentScore
        });

    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});


    // Update existing quiz endpoint
    app.put('/quizzes/:id', async (req, res) => {
        try {
            const updatedQuiz = await Quiz.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            
            if (!updatedQuiz) {
                return res.status(404).json({ message: 'Quiz not found' });
            }
    
            res.json({
                message: 'Quiz updated successfully',
                quiz: updatedQuiz
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

// Update specific question in a quiz
app.put('/quizzes/:quizTitle/questions/:questionIndex', async (req, res) => {
    try {
        const { quizTitle, questionIndex } = req.params;
        const updatedQuestionData = req.body;

        const quiz = await Quiz.findOne({ title: quizTitle });
        
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const questionIdx = parseInt(questionIndex);
        if (questionIdx >= quiz.questions.length || questionIdx < 0) {
            return res.status(400).json({ message: 'Invalid question index' });
        }

        // Update specific question
        quiz.questions[questionIdx] = {
            question: updatedQuestionData.question || quiz.questions[questionIdx].question,
            options: updatedQuestionData.options || quiz.questions[questionIdx].options,
            correctAnswer: updatedQuestionData.correctAnswer || quiz.questions[questionIdx].correctAnswer,
            image: updatedQuestionData.image || quiz.questions[questionIdx].image,
            imageData: updatedQuestionData.imageData || quiz.questions[questionIdx].imageData
        };

        const updatedQuiz = await quiz.save();

        res.json({
            message: 'Question updated successfully',
            quiz: updatedQuiz
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});