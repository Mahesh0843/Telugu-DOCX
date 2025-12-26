const fs = require("fs");
// Ensure this name 'pdfParse' is what you call below
const pdfParse = require("pdf-parse");

async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    
    // Call the variable defined in the require statement above
    const data = await pdfParse(dataBuffer);
    
    if (!data || !data.text) {
      throw new Error("PDF contains no readable text.");
    }
    
    return data.text;
  } catch (error) {
    console.error("PDF Service Error:", error.message);
    throw new Error("Failed to read PDF file. Please ensure 'pdf-parse' is installed."); 
  }
}

module.exports = extractTextFromPDF;