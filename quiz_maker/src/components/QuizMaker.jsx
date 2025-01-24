import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import React, { useState } from 'react';
import { generateQuizPDF } from './pdfGenerator';


const QuizMaker = () => {

    const [shuffleOptions, setShuffleOptions] = useState(false);

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    

    const [isUpdating, setIsUpdating] = useState(false);

    const [quiz, setQuiz] = useState({
        title: '',
        timeLimit: 0,
        questions: []
    });
    const [editingIndex, setEditingIndex] = useState(null);






    const editQuestion = (index) => {
        setEditingIndex(index);
        setCurrentQuestion({ ...quiz.questions[index] });
    };

    const deleteQuestion = (index) => {
        const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
        setQuiz(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };

    const updateQuestion = async () => {
        if (editingIndex !== null) {
            setIsUpdating(true);
            try {


                // Validate data before sending
                if (!currentQuestion.question || !currentQuestion.correctAnswer) {
                    throw new Error('Question and correct answer are required');
                }

                // Prepare data for API
                const questionData = {
                    question: currentQuestion.question,
                    options: currentQuestion.options.filter(opt => opt !== ''),
                    correctAnswer: currentQuestion.correctAnswer,
                    imageData: currentQuestion.imageData
                };


                console.log('Editing Index:', editingIndex); // Debug log

                // Make API call to update question
                const response = await axios.put(
                    `http://localhost:3000/quizzes/${quiz.title}/questions/${editingIndex}`,
                    questionData
                );

                if (response.status === 200) {
                    // Update local state
                    const updatedQuestions = [...quiz.questions];
                    updatedQuestions[editingIndex] = questionData;
                    setQuiz(prev => ({
                        ...prev,
                        questions: updatedQuestions
                    }));
                    setEditingIndex(null);
                    setCurrentQuestion({
                        question: '',
                        options: ['', '', '', ''],
                        correctAnswer: '',
                        image: null,
                        imageData: null
                    });
                }
            } catch (error) {
                console.error('Failed to update question:', error.response?.data || error.message);
                alert(`Failed to update question: ${error.message}`);
            } finally {
                setIsUpdating(false);
            }
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
            questions: quiz.questions.map((q, index) => ({
                id: q._id || index,
                question: q.question,
                options: q.options,
                imageData: q.imageData
            }


            ))
        }
        const finalQuestions = shuffleOptions ?
            quiz.questions.map(q => ({
                ...q,
                options: shuffleArray(q.options)
            })) :
            quiz.questions;
        try {
            axios.post('http://localhost:3000/quizzes', { title: quiz.title, questions: finalQuestions });
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


    // const generatePDF = () => {
    //     const doc = new jsPDF();
    //     const pageWidth = doc.internal.pageSize.width;
    //     const pageHeight = doc.internal.pageSize.height;
    //     const margin = 15;
    
    //     // Add title at the top of the first page
    //     doc.setFont("times", "bold");
    //     doc.setFontSize(22);
    //     doc.text(quiz.title, pageWidth / 2, margin, { align: "center" });
    
    //     // Set the font for the content
    //     doc.setFont("times", "normal");
    //     doc.setFontSize(16);
    
    //     let currentY = margin + 20; // Initial Y position after the title
    
    //     quiz.questions.forEach((question, index) => {
    //         const questionStartY = currentY;
    
    //         // Add question text
    //         doc.setFontSize(14);
    //         doc.text(`Q${index + 1}: ${question.question}`, margin, currentY);
    //         currentY += 10;
    
    //         // Add image if available
    //         if (question.imageData) {
    //             const img = new Image();
    //             img.src = question.imageData;
    //             img.onload = () => {
    //                 doc.addImage(img, "JPEG", margin, currentY, 60, 40);
    //                 currentY += 45; // Adjust Y position after the image
    //             };
    //         }
    
    //         // Add options with proper indentation
    //         doc.setFontSize(12);
    //         question.options.forEach((option, optIndex) => {
    //             doc.text(
    //                 `${String.fromCharCode(65 + optIndex)}. ${option}`,
    //                 margin + 10,
    //                 currentY
    //             );
    //             currentY += 8;
    //         });
    
    //         // Add a horizontal line after each question
    //         currentY += 5;
    //         doc.setDrawColor(200);
    //         doc.line(margin, currentY, pageWidth - margin, currentY);
    //         currentY += 10;
    
    //         // Check if the content goes beyond the page height
    //         if (currentY > pageHeight - margin) {
    //             doc.addPage();
    //             currentY = margin; // Reset Y position for the new page
    //         }
    //     });
    
    //     // Footer on each page
    //     const pageCount = doc.internal.getNumberOfPages();
    //     for (let i = 1; i <= pageCount; i++) {
    //         doc.setPage(i);
    //         doc.setFontSize(10);
    //         doc.text(
    //             `Page ${i} of ${pageCount}`,
    //             pageWidth / 2,
    //             pageHeight - 10,
    //             { align: "center" }
    //         );
    //     }
    
    //     // Save the PDF
    //     doc.save(`${quiz.title.replace(/\s+/g, '_')}_quiz.pdf`);
    // };
    
    
   

    // Call this function when you want to generate the PDF


    const handleGeneratePDF = () => {
        generateQuizPDF({
            title: quiz.title,
            questions: quiz.questions,
            fileName: `${quiz.title.replace(/\s+/g, '_')}_quiz.pdf`,
            options: {
                margin: 15,
                fontSize: {
                    title: 22,
                    question: 14,
                    option: 12,
                    footer: 10
                },
                imageSize: {
                    width: 60,
                    height: 40
                }
            }
        });
    };


    return (
        <div className="quiz-maker p-6 ">
            <h2 className='text-2xl font-bold mb-6'>Create New Quiz</h2>
            <h5 className='text-xl  mb-6 mr-7'>
                Shuffle Options
                <input 
            type="checkbox" 
            className="checkbox checkbox-primary checkbox-sm ml-6" 
            checked={shuffleOptions}
            onChange={(e) => setShuffleOptions(e.target.checked)}
        />
                 </h5>

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

                    <div className="mt-4">
                        <button
                            className='btn btn-primary w-full'
                            onClick={editingIndex !== null ? updateQuestion : addQuestion}
                            disabled={isUpdating}
                        >
                            {editingIndex !== null ? 'Update Question' : 'Add Question'}
                        </button>
                    </div>                </div>
            </div>


            <div className="questions-list p-4">
                <h3 className='text-xl font-bold mb-4'>Questions ({quiz.questions.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quiz.questions.map((q, index) => (
                        <div key={index} className="question-item p-4 border rounded-lg shadow-sm">
                            <p><strong>Q{index + 1}:</strong> {q.question}</p>
                            {q?.imageData && (
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
     
            {quiz.questions.length > 0 && (
                <>
                    <button className='btn bg-success w-full text-white' onClick={generateQuizFile}>Create and Generate Quiz HTML</button>
                    <button className='btn bg-success w-full text-white' onClick={handleGeneratePDF}>Generate PDF</button>
                </>
            )}
        </div>
    );
};

export default QuizMaker;
