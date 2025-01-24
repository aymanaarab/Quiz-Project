import jsPDF from "jspdf";
import universityLogo from '../assets/header.png'; // Make sure logo.png exists in assets folder


export const generateQuizPDF = async ({
    title,
    questions,
    fileName = "quiz.pdf",
    options = {
        margin: 15,
        fontSize: {
            title: 22,
            question: 14,
            option: 12,
            footer: 10,
        },
        imageSize: {
            width: 60,
            height: 40,
        },
    },
}) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const { margin } = options;

    


    // Load image as a Promise
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = reject;
        });
    };
    // Wait for the header image to load
    const headerImg = await loadImage(universityLogo);

    // Calculate aspect ratio
    const aspectRatio = headerImg.width / headerImg.height;

    // Set fixed height for header
    const headerHeight = 40; // Adjust as needed
    const headerWidth = headerHeight * aspectRatio;

    // Calculate center position
    const centerX = (pageWidth - headerWidth) / 2;

    try {
        // Wait for the header image to load
        const headerImg = await loadImage(universityLogo); // Adjust path as needed

        // Add header to the first page
        doc.addImage(
            headerImg,
            "PNG",
            centerX,
            5,
            headerWidth,
            headerHeight
        );
    } catch (err) {
        console.error("Failed to load the header image:", err);
    }

    // Add title
    doc.setFont("times", "bold");
    doc.setFontSize(options.fontSize.title);
    doc.text(title, pageWidth / 2, margin + headerHeight, { align: "center" });

    // Set content font
    doc.setFont("times", "normal");
    doc.setFontSize(options.fontSize.question);

    let currentY = margin + headerHeight + 20;

    questions.forEach((question, index) => {
        // Add question text
        doc.setFontSize(options.fontSize.question);
        doc.text(`Q${index + 1}: ${question.question}`, margin, currentY);
        currentY += 10;

        // Add image if available
        if (question.imageData) {
            const questionImg = new Image();
            questionImg.src = question.imageData;

            // Wait for the image to load
            questionImg.onload = () => {
                doc.addImage(
                    questionImg,
                    "JPEG",
                    margin,
                    currentY,
                    options.imageSize.width,
                    options.imageSize.height
                );
                currentY += options.imageSize.height + 5;
            };
        }

        // Add options
        doc.setFontSize(options.fontSize.option);
        question.options.forEach((option, optIndex) => {
            doc.text(
                `${String.fromCharCode(65 + optIndex)}. ${option}`,
                margin + 10,
                currentY
            );
            currentY += 8;
        });

        // Add separator
        currentY += 5;
        doc.setDrawColor(200);
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 10;

        // Check page break
        if (currentY > pageHeight - margin) {
            doc.addPage();
            currentY = margin + headerHeight;
        }
    });

    // Add footer to all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(options.fontSize.footer);
        doc.text(
            `Page ${i} of ${pageCount}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: "center" }
        );
    }

    // Save PDF
    doc.save(fileName);
};
