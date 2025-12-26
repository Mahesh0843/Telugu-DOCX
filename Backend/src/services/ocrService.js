const Tesseract = require("tesseract.js");

async function extractTextFromImage(path) {
  const result = await Tesseract.recognize(
    path,
    "eng", // Telugu OCR later (tel+eng)
    { logger: m => console.log(m) }
  );
  return result.data.text;
}

module.exports = extractTextFromImage;
