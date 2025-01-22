import React from 'react'

export default function PdfGenerator({quiz}) {
  return ( <div></div>

   
    //    const doc = new jsPDF();
    // //     doc.setFontSize(22);
    // //     doc.text(quiz.title, 10, 10);
    // //     doc.setFontSize(16);
    
    // //     quiz.questions.forEach((question, index) => {
    // //         doc.setFontSize(14);
    // //         doc.text(`Q${index + 1}: ${question.question}`, 10, 30 + index * 60);
    
    // //         if (question.imageData) {
    // //             const img = new Image();
    // //             img.src = question.imageData;
    // //             img.onload = () => {
    // //                 doc.addImage(img, 'JPEG', 10, 40 + index * 60, 50, 50);
    // //             };
    // //         }
    
    // //         doc.setFontSize(12);
    // //         question.options.forEach((option, optIndex) => {
    // //             doc.text(`- ${option}`, 10, 50 + index * 60 + optIndex * 10);
    // //         });
    
    //         if (index < quiz.questions.length - 1) {
    //             doc.addPage();
    //         }
    //     });
    
    //     doc.save(`${quiz.title.replace(/\s+/g, '_')}_quiz.pdf`);
    // };
)
}
