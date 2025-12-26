const path = require('path');
const fs = require('fs');
const extractPDF = require('../services/pdfService');
const extractImage = require('../services/ocrService');
const translateToTelugu = require('../services/translateService');
const createDoc = require('../services/docService');

/**
 * Controller to handle document/image conversion and translation
 */
exports.convert = async (req, res) => {
  try {
    // 1. Validation: Ensure a file was actually uploaded via Multer
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const outputDir = 'output';
    
    // 2. Setup: Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`📄 Processing file: ${file.originalname}`);

    let extractedText = '';
    
    // 3. Extraction: Check file type and call the appropriate service
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (file.mimetype === 'application/pdf' || fileExtension === '.pdf') {
      console.log('📖 Extracting text from PDF...');
      extractedText = await extractPDF(file.path);
    } else {
      console.log('🖼️ Extracting text from Image (OCR)...');
      extractedText = await extractImage(file.path);
    }

    // 4. Translation: Send extracted English text to Gemini for Telugu translation
    console.log('🌐 Translating to Telugu (Physical Science Context)...');
    const teluguText = await translateToTelugu(extractedText);

    // 5. Document Creation: Generate the .docx file with the Telugu content
    const outputName = `translated_${Date.now()}.docx`;
    const outputPath = path.join(outputDir, outputName);
    await createDoc(teluguText, outputPath);

    // 6. Response: Set headers to ensure Postman/Browser treats this as a download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=${outputName}`);

    // 7. Finalization: Send file and clean up temporary uploaded file
    return res.download(outputPath, (err) => {
      if (err) {
        console.error('Download Error:', err.message);
      }
      
      // Cleanup: Delete the original uploaded file from the 'uploads' folder
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      console.log('✅ Conversion complete and temporary file cleaned.');
    });
    
  } catch (error) {
    console.error('❌ Conversion failed:', error.message);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
};