import { Document, Packer, Paragraph, TextRun, Header, ImageRun } from "docx";
import { saveAs } from "file-saver";

export const generateWord = async ({
  title,
  universityLogo,
  questions,
  fileName = "quiz.docx",
}) => {
  // Load the university logo (should be base64 data or a URL)
  const headerLogo = universityLogo
    ? new ImageRun({
        data: await fetch(universityLogo).then((res) => res.blob()), // Fetch and convert the logo to Blob
        transformation: { width: 300, height: 100 }, // Adjust logo size
      })
    : null;

  // Create the document
  const doc = new Document({
    sections: [
      {
        properties: {},
        headers: {
          default: new Header({
            children: [
              headerLogo
                ? new Paragraph({
                    children: [headerLogo],
                    alignment: "center",
                  })
                : null,
            ],
          }),
        },
        children: [
          // Add the quiz title
          new Paragraph({
            children: [
              new TextRun({
                text: title,
                bold: true,
                size: 32, // Font size in half-points
              }),
            ],
            alignment: "center",
            spacing: { after: 400 },
          }),

          // Add questions and options
          ...questions.flatMap((question, index) => {
            const questionText = new Paragraph({
              children: [
                new TextRun({
                  text: `Q${index + 1}: ${question.question}`,
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { after: 200 },
            });

            const optionsParagraphs = question.options.map(
              (option, optIndex) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${String.fromCharCode(65 + optIndex)}. ${option}`,
                      size: 22, // Adjust font size for options
                    }),
                  ],
                  spacing: { after: 100 },
                })
            );

            return [questionText, ...optionsParagraphs];
          }),
        ],
      },
    ],
  });

  // Generate and save the Word document
  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName);
};
