import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const QCM = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const pdfRef = useRef(null);

  const questions = [
    {
      id: 1,
      question: 'Le nombre binaire 1011 vaut en décimal :',
      options: ['7', '9', '33', '11'],
      correctAnswer: '11',
    },
    {
      id: 2,
      question: 'Le nombre qui suit le nombre 4 en base 5 est :',
      options: ['10', '5', '0', 'A'],
      correctAnswer: '10',
    },
    // Add more questions here...
  ];

  const handleOptionChange = (questionId, option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: option,
    });
  };

  const handleSubmit = () => {
    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    alert(`Votre score est ${score} sur ${questions.length}`);
  };

  const handleDownloadPDF = () => {
    const input = pdfRef.current;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('qcm_exam.pdf');
    });
  };

  return (
    <div ref={pdfRef} style={{ padding: '24px', backgroundColor: '#ffffff' }}>
      {questions.map((q) => (
        <div 
          key={q.id} 
          style={{
            marginBottom: '24px',
            padding: '24px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px', color: '#212529' }}>
            {q.question}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {q.options.map((option, index) => (
              <label
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={option}
                  checked={selectedAnswers[q.id] === option}
                  onChange={() => handleOptionChange(q.id, option)}
                  style={{ width: '20px', height: '20px' }}
                />
                <span style={{ marginLeft: '12px', color: '#212529' }}>{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#0d6efd',
          color: '#ffffff',
          borderRadius: '8px',
          fontWeight: '600',
          marginBottom: '16px',
          border: 'none'
        }}
      >
        Soumettre les réponses
      </button>
      <button
        onClick={handleDownloadPDF}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#198754',
          color: '#ffffff',
          borderRadius: '8px',
          fontWeight: '600',
          border: 'none'
        }}
      >
        Télécharger en PDF
      </button>
    </div>
  );
};


export default QCM;