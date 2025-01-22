import React, { useState, useEffect } from 'react';
import Question from './Question';
import Timer from './Timer';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    // Fetch or set questions here
    useEffect(() => {
        const fetchedQuestions = [
            { question: 'What is the capital of France?', options: ['Paris', 'London', 'Berlin'], answer: 'Paris' },
            { question: 'What is 2 + 2?', options: ['3', '4', '5'], answer: '4' }
        ];
        setQuestions(fetchedQuestions);
    }, []);

    const handleAnswer = (selectedOption) => {
        if (selectedOption === questions[currentQuestionIndex].answer) {
            setScore(score + 1);
        }
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setIsFinished(true);
        }
    };

    return (
        <div>
            {isFinished ? (
                <h2>Your score: {score}/{questions.length}</h2>
            ) : (
                <div>
                    <Timer duration={30} />
                    <Question 
                        question={questions[currentQuestionIndex].question} 
                        options={questions[currentQuestionIndex].options} 
                        onAnswer={handleAnswer} 
                    />
                </div>
            )}
        </div>
    );
};

export default Quiz;
