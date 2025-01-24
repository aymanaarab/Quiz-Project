import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ModifyQuiz() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        image: null,
        imageData: null
    });


    const [isModifying, setIsModifying] = useState(false);

    const handleModify = async () => {
        setIsModifying(true);
        try {
            await axios.put(`http://localhost:3000/quizzes/${id}`, quiz);
            alert('Quiz modified successfully');
        } catch (error) {
            console.error('Failed to modify quiz:', error);
            alert('Failed to modify quiz');
        } finally {
            setIsModifying(false);
        }
    };

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/quizzes/${id}`);
                setQuiz(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch quiz');
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!quiz) return <div>Quiz not found</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Modify Quiz</h2>
            <div className="space-y-4">
                <input
                    type="text"
                    className="input input-bordered w-full"
                    value={quiz.title}
                    onChange={(e) => setQuiz({...quiz, title: e.target.value})}
                />
                
                <div className="questions-list space-y-4">
                <div className="questions-list space-y-4">
    {quiz.questions.map((question, index) => (
        <div key={index} className="question-card p-4 border rounded">
            <h3>Question {index + 1}</h3>
            <input
                type="text"
                className="input input-bordered w-full mt-2"
                value={question.question}
                onChange={(e) => {
                    const updatedQuestions = [...quiz.questions];
                    updatedQuestions[index].question = e.target.value;
                    setQuiz({...quiz, questions: updatedQuestions});
                }}
            />
            <div className="options-grid grid grid-cols-2 gap-2 mt-2">
                {question.options.map((option, optIndex) => (
                    <input
                        key={optIndex}
                        type="text"
                        className="input input-bordered"
                        value={option}
                        onChange={(e) => {
                            const updatedQuestions = [...quiz.questions];
                            updatedQuestions[index].options[optIndex] = e.target.value;
                            setQuiz({...quiz, questions: updatedQuestions});
                        }}
                    />
                ))}
                <div className="image-section mt-4">
                {question.imageData && (
                    <div className="image-preview mb-2">
                        <img 
                            src={question.imageData}
                            alt={`Question ${index + 1}`}
                            className="max-w-xs rounded"
                        />
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                const updatedQuestions = [...quiz.questions];
                                updatedQuestions[index].imageData = event.target.result;
                                setQuiz({...quiz, questions: updatedQuestions});
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                    className="file-input file-input-bordered w-full"
                />
            </div>

            </div>
            <select
                className="select select-bordered w-full mt-2"
                value={question.correctAnswer}
                onChange={(e) => {
                    const updatedQuestions = [...quiz.questions];
                    updatedQuestions[index].correctAnswer = e.target.value;
                    setQuiz({...quiz, questions: updatedQuestions});
                }}
            >
                <option value="">Select correct answer</option>
                {question.options.map((option, optIndex) => (
                    <option key={optIndex} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    ))}
    <div className="p-6">
            <div className="mt-6">
                <button 
                    className="btn btn-primary w-full"
                    onClick={handleModify}
                    disabled={isModifying}
                >
                    {isModifying ? 'Modifying...' : 'Save Changes'}
                </button>
            </div>
        </div>
</div>
                </div>
            </div>
        </div>
    );
}