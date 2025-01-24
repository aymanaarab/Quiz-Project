import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactConfetti from 'react-confetti';
const QuizTaker = () => {
    const [quizData, setQuizData] = useState(null);
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const timerRef = useRef(null);
    const [timeSpent, setTimeSpent] = useState(0);
    const [quizResults, setQuizResults] = useState(null);
    const [nameTaker, setNameTaker] = useState("");


    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target.result;
                try {
                    const quizDataMatch = content.match(/const QUIZ_DATA = ({[\s\S]*?});/);

                    if (quizDataMatch) {
                        const quizData = JSON.parse(quizDataMatch[1]);
                        console.log('Loaded Quiz Data:', quizData);
                        setQuizData(quizData);
                        setTimeLeft(quizData.timeLimit * 60);
                        setAnswers({});
                        setQuizSubmitted(false);
                        setScore(0);
                    } else {
                        alert('Could not find quiz data in the file. Please make sure you are using a valid quiz file.');
                    }
                } catch (error) {
                    console.error('Error parsing quiz file:', error);
                    alert('Invalid quiz file format. Please make sure you are using a valid quiz file.');
                }
            };
            reader.readAsText(file);
        }
    };


    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isQuizStarted) {
            const startTime = Date.now();
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        submitQuiz();
                        return 0;
                    }
                    setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
                    return prev - 1;
                });
            }, 1000);
        } return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isQuizStarted]);



    const startQuiz = () => {
        setIsQuizStarted(true);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    submitQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleAnswerSelect = (questionId, answer) => {
        console.log('Selected answer for question', questionId + 1, ':', answer);
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };


    // Replace/Update submitQuiz function
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitQuiz = async () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        setIsSubmitting(true);

        try {
            const formattedAnswers = quizData.questions.map((_, index) =>
                answers[index] || ''
            );

            const response = await axios.post('http://localhost:3000/calculate-score', {
                quizTitle: quizData.title,
                studentAnswers: formattedAnswers , 
                studentName : nameTaker
            });

            setQuizResults(response.data);
            setScore(response.data.percentage);
            setQuizSubmitted(true);
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit quiz: ' + (error.response?.data?.error || 'Unknown error'));
        } finally {
            setIsSubmitting(false);
        }
    };


    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
    const formatTimeLimit = (minutes) => {
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    };






    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Online Quiz</h2>

                {!quizData && (
                    <div className="bg-white shadow-sm rounded-lg p-6">
                    <label htmlFor=""> Whats your name ?   </label>
                     <input
                    type="text"
                    placeholder=""
                    className="input input-bordered input-s  w-full "
                    value={nameTaker}
                    onChange={(e)=> setNameTaker(e.target.value)}
                />
                        <p className="text-gray-600 mb-4">Please upload the quiz file provided by your professor.</p>
                        <input
                            type="file"
                            accept=".html"
                            onChange={handleFileUpload}
                            className="file-input file-input-bordered w-full"
                        />
                    </div>
                )}

                {quizData && !isQuizStarted && (
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">{quizData.title}</h3>
                        <div className="space-y-2 text-gray-600 mb-6">
                            <p className="flex items-center">
                                <span className="font-medium">Time limit:</span>
                                <span className="ml-2">{formatTimeLimit(quizData.timeLimit)}</span>
                            </p>
                            <p className="flex items-center">
                                <span className="font-medium">Questions:</span>
                                <span className="ml-2">{quizData.questions.length}</span>
                            </p>
                        </div>
                        <button
                            onClick={startQuiz}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Start Quiz
                        </button>
                    </div>
                )}

                {quizData && isQuizStarted && !quizSubmitted && (
                   
                   
                   <div className="space-y-6">
                        <div className="bg-blue-100 text-blue-800 py-2 px-4 rounded-md sticky top-0 shadow-sm mb-4">
                            <div className="text-center font-semibold">
                                Time remaining: {formatTime(timeLeft)}
                            </div>
                        </div>

                        {quizData.questions.map((question, questionIndex) => (
                            <div key={question.id} className="bg-white shadow-sm rounded-lg p-6">
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Question {questionIndex + 1}
                                    </h3>
                                    <p className="text-gray-700 mt-2">{question.question}</p>
                                    {question.imageData && (
                                        <div className="mt-4">
                                            <img
                                                src={question.imageData}
                                                alt={`Question ${questionIndex + 1}`}
                                                className="max-w-full rounded-md"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {question.options.map((option, optionIndex) => (
                                        <label
                                            key={optionIndex}
                                            className="flex items-center p-3 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${question.id}`}
                                                value={option}
                                                checked={answers[question.id] === option}
                                                onChange={(e) => handleAnswerSelect(question.id, e.target.value)}
                                                className="radio radio-primary"
                                                disabled={quizSubmitted}
                                                required
                                            />
                                            <span className="ml-3 text-gray-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="mt-6">
                            <button
                                onClick={submitQuiz}
                                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                Submit Quiz
                            </button>
                        </div>
                    </div>
               
                )}
                {quizSubmitted && quizResults && (

                    
                    <div className="bg-white shadow-sm rounded-lg p-6 mt-8">
                        <ReactConfetti/>
                        <h3 className="text-xl font-semibold mb-4">Quiz Results</h3>
                        <div className="space-y-4">
                            <p className="text-lg">
                                Score: {quizResults.percentage.toFixed(2)}%
                            </p>
                            <p>
                                Correct Answers: {quizResults.correctAnswers} / {quizResults.totalQuestions}
                            </p>
                            <p>
                                Date Taken: {new Date(quizResults.savedRecord.dateTaken).toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default QuizTaker;
