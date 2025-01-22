import React, { useState, useEffect, useRef } from 'react';

const QuizTaker = () => {
    const [quizData, setQuizData] = useState(null);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const timerRef = useRef(null);
console.log(quizData);
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
                        setTimeLeft(quizData.timeLimit);
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

    const handleAnswerSelect = (questionIndex, answer) => {
        console.log('Selected answer for question', questionIndex + 1, ':', answer);
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: answer
        }));
    };

  


    const submitQuiz = async () => {
        if (!quizSubmitted && quizData) {
            clearInterval(timerRef.current);
            
            const submissionData = {
                quizTitle: quizData.title,
                studentAnswers: answers,
            };

            try {
                const response = await fetch('http://localhost:3000/calculate-score', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(submissionData)
                });
                
                if (!response.ok) {
                    throw new Error('Server response was not ok');
                }

                const result = await response.json();
                console.log("result", result);
                setScore(result.correctAnswers);
                setQuizSubmitted(true);
                setTimeLeft(0);
            } catch (error) {
                console.error('Error submitting quiz:', error);
                alert('Failed to submit quiz. Please try again.');
            }
        }
    };







    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };
    const resetQuiz = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setAnswers({});
        setQuizSubmitted(false);
        setScore(0);
        setIsQuizStarted(false);
        setTimeLeft(quizData.timeLimit);
    };

    if (quizSubmitted) {
        const percentage = (score / quizData.questions.length) * 100;
        return (
            <div className="quiz-results">
                <h2>Quiz Results</h2>
                <p>Your score: {score} out of {quizData.questions.length}</p>
                <p>Percentage: {percentage.toFixed(2)}%</p>
            
            </div>
        );
    }
  
    return (
        <div className="quiz-taker">
            <h2>Take Quiz</h2>
            {!quizData && (
                <div className="file-upload">
                    <p>Please upload the quiz file provided by your professor.</p>
                    <input 
                        type="file" 
                        accept=".html" 
                        onChange={handleFileUpload}
                        className="file-input" 
                    />
                </div>
            )}

            {quizData && !isQuizStarted && (
                <div className="quiz-start">
                    <h3>{quizData.title}</h3>
                    <p>Time limit: {formatTime(quizData.timeLimit)}</p>
                    <p>Number of questions: {quizData.questions.length}</p>
                    <button onClick={startQuiz} className="start-button">
                        Start Quiz
                    </button>
                </div>
            )}

            {quizData && isQuizStarted && !quizSubmitted && (
                <div className="quiz-content">

    
<div className="timer">Time remaining: {formatTime(timeLeft)}</div>
    
                   {quizData.questions.map((question, questionIndex) => (
                        <div key={questionIndex} className="question-container">
                            <h3>Question {questionIndex + 1}</h3>
                            <p>{question.question}</p>
                            {question.imageData && (
                                <img 
                                    src={question.imageData} 
                                    alt={`Question ${questionIndex + 1} illustration`}
                                    className="question-image"
                                />
                            )}
                            <div className="options">
                                {question.options.map((option, optionIndex) => (
                                    <label key={optionIndex} className="option-label">
                                        <input
                                            type="radio"
                                            name={`question-${questionIndex}`}
                                            value={option}
                                            checked={answers[questionIndex] === option}
                                            onChange={() => handleAnswerSelect(questionIndex, option)}
                                            required
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button onClick={submitQuiz} className="submit-button">
                        Submit Quiz
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuizTaker;
