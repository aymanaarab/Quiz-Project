import React from 'react';

const Question = ({ question, options, onAnswer }) => {
    return (
        <div>
            <h3>{question}</h3>
            <ul>
                {options.map((option, index) => (
                    <li key={index} onClick={() => onAnswer(option)}>{option}</li>
                ))}
            </ul>
        </div>
    );
};

export default Question;
