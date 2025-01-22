import axios from 'axios';
import jsPDF from 'jspdf';
import { FaEdit, FaTrash } from 'react-icons/fa';  
import React, { useState } from 'react';

const QuizMaker = () => {
    const [quiz, setQuiz] = useState({
        title: '',
        timeLimit: 0,
        questions: []
    });
    const [editingIndex, setEditingIndex] = useState(null);

    const editQuestion = (index) => {
        setEditingIndex(index);
        setCurrentQuestion({...quiz.questions[index]});
    };
    
    const deleteQuestion = (index) => {
        const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
        setQuiz(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };
const updateQuestion = () => {
    if (editingIndex !== null) {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[editingIndex] = currentQuestion;
        
        setQuiz(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
        
        // Reset editing state
        setEditingIndex(null);
        setCurrentQuestion({
            question: '',
            options: ['', '', '', ''],
            correctAnswer: '',
            image: null,
            imageData: null
        });
    }
};


    const [currentQuestion, setCurrentQuestion] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        image: null,
        imageData: null
    });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCurrentQuestion(prev => ({
                    ...prev,
                    image: file.name,
                    imageData: event.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };
  

    const addQuestion = () => {
        if (currentQuestion.question && currentQuestion.correctAnswer) {
            const newQuestion = {
                question: currentQuestion.question,
                options: currentQuestion.options.filter(opt => opt.trim() !== ''),
                correctAnswer: currentQuestion.correctAnswer,
                image: currentQuestion.image,
                imageData: currentQuestion.imageData
            };

            setQuiz(prev => ({
                ...prev,
                questions: [...prev.questions, newQuestion]
            }));

            setCurrentQuestion({
                question: '',
                options: ['', '', '', ''],
                correctAnswer: '',
                image: null,
                imageData: null
            });
        }
    };

    const generateQuizFile = () => {
        
        const quizData = {
            title: quiz.title,
            timeLimit: quiz.timeLimit,
            questions: quiz.questions.map(q => ({
                question: q.question,
                options: q.options,
                imageData: q.imageData
            }))
        };
        try {
             axios.post('http://localhost:3000/quizzes', { title: quiz.title,  questions: quiz.questions });
            alert('Quiz created successfully');
        } catch (err) {
            console.error(err);
            alert('Error creating quiz');
        }
  

        const quizHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${quiz.title}</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                    .question { margin-bottom: 20px; }
                    .option { margin: 10px 0; cursor: pointer; }
                    .timer { position: fixed; top: 20px; right: 20px; }
                    .question-image { max-width: 100%; margin: 10px 0; }
                </style>
            </head>
            <body>
                <script>
                    const QUIZ_DATA = ${JSON.stringify(quizData, null, 2)};
                </script>
                <h1>${quiz.title}</h1>
                <div id="quiz-content"></div>
            </body>
            </html>
        `;

        const blob = new Blob([quizHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${quiz.title.replace(/\s+/g, '_')}_quiz.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="quiz-maker p-6 ">
            <h2 className='text-2xl font-bold mb-6'>Create New Quiz</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Quiz Title"
                    className="input input-bordered input-primary w-full max-w-xs"
                    value={quiz.title}
                    onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }


                        
                    ))}
                />


                <input
                    type="number"
                    placeholder="Time Limit (minutes)"
                     className="input input-bordered input-primary w-full max-w-xs"
                    value={quiz.timeLimit}
                    onChange={(e) => setQuiz(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                />
            </div>

            <div className="question-form  space-y-4">
                <h3>Add Question</h3>
                <input
                    type="text"
                     className="input input-bordered input-primary w-full max-w-xs"
                    placeholder="Question"
                    value={currentQuestion.question}
                    onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                />
                
                <div className="image-upload">
                    <label>Add Image (optional): </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file-input file-input-bordered file-input-primary file-input-xs  w-full max-w-xs"
                                            />
                    {currentQuestion.imageData && (
                        <div className="image-preview">
                            <img 
                                src={currentQuestion.imageData} 
                                alt="Question preview" 
                              className="mt-2 max-w-xs"
                            />
                        </div>
                    )}
                </div>
              
                <div className="flex flex-wrap gap-4">

                {currentQuestion.options.map((option, index) => (
                    <input
                        key={index}
                        type="text"
                        className="file-input file-input-bordered file-input-primary w-full max-w-xs" 
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                            const newOptions = [...currentQuestion.options];
                            newOptions[index] = e.target.value;
                            setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
                        }}
                    />
                ))}
                    </div>
                <select className="select select-bordered w-full max-w-xs"
                    value={currentQuestion.correctAnswer}
                    onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                >
                    <option value="">Select Correct Answer</option>
                    {currentQuestion.options.map((option, index) => (
                        option && <option key={index} value={option}>{option}</option>
                    ))}
                </select>
            
                <div className='text-center'>

                <button className='btn btn-primary w-full' onClick={addQuestion}>Add Question</button>
                </div>
            </div>

        
<div className="questions-list p-4">
    <h3 className='text-xl font-bold mb-4'>Questions ({quiz.questions.length})</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {quiz.questions.map((q, index) => (
            <div key={index} className="question-item p-4 border rounded-lg shadow-sm">
            <p><strong>Q{index + 1}:</strong> {q.question}</p>
            {q.imageData && (
                <img 
                    src={q.imageData} 
                    alt={`Question ${index + 1} image`} 
                    style={{ maxWidth: '200px', margin: '10px 0' }}
                />
            )}
            <p><strong>Options:</strong> {q.options.join(', ')}</p>
            <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
            <div className="flex gap-2 mt-2">
            <button onClick={() => editQuestion(index)}>
            <FaEdit className="text-primary text-xl" />

            </button>
                <button 
                    onClick={() => deleteQuestion(index)}
                    style={{ marginLeft: '10px', backgroundColor: '#ff4444' }}
                >
        <FaTrash className="text-error text-xl" />
        </button>
            </div>
        </div>
    ))}
</div>
</div>
{/* <div className="card bg-base-100 w-96 shadow-xl">
  <figure className="px-10 pt-10">
    <img
      src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
      alt="Shoes"
      className="rounded-xl" />
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title">Shoes!</h2>
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div className="card-actions">
      <button className="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div> */}

            {quiz.questions.length > 0 && (
                <>
                <button className='btn bg-success w-full text-white' onClick={generateQuizFile}>Generate Quiz HTML</button>
                {/* <button onClick={generatePDF}>Generate PDF</button> */}
                </>
            )}
        </div>
    );
};

export default QuizMaker;
