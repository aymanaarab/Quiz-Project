import React, { useEffect, useState } from 'react'
import { generateQuizPDF } from './pdfGenerator'
import {  generateWord } from './wordGenerator';
import universityLogo from '../assets/header.png'; // Make sure logo.png exists in assets folder


export default function Quiz({ quiz, onDelete, onModify }) {
  const [base64Logo, setBase64Logo] = useState(null);

  useEffect(() => {
    // Convert image to Base64 when the component mounts
    const convertImageToBase64 = (imageUrl) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png'); // Convert image to Base64
          resolve(dataUrl); // Resolve with Base64 string
        };
        img.onerror = reject; // Reject if there's an error loading the image
      });
    };

    // Load the logo and set it to the state as Base64
    convertImageToBase64(universityLogo).then((base64Image) => {
      setBase64Logo(base64Image);
    });
  }, []);
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
  const handlegenerateWord = () => {
    if (base64Logo) {
      generateWord({
        title: quiz.title,
        universityLogo: base64Logo, // Pass Base64 logo here
        questions: quiz.questions,
        fileName: `${quiz.title.replace(/\s+/g, '_')}_quiz.docx`,
      });
    } else {
      console.error('Logo image is not loaded yet');
    }
  };
  return (
    <div className="card bg-primary text-primary-content w-96">
      <div className="card-body">
        <h2 className="card-title"> {quiz.title}</h2>
        <p>Questions : {quiz.questions.length}</p>
        <div className="card-actions justify-end">
          <button className="btn" onClick={() => onModify(quiz._id)}>Modify</button>
          <button className="btn bg-red-600" onClick={() => onDelete(quiz._id)}>Delete</button>
          <button className="btn bg-green-600" onClick={handleGeneratePDF}>PDF</button>
          <button className="btn bg-green-600" onClick={handlegenerateWord}> Word </button>
        </div>
      </div>
    </div>
  )
}
