const { GoogleGenerativeAI } = require('@google/generative-ai');

async function translateToTelugu(text) {
  if (!text) return '';

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY not set; returning original text');
    return text;
  }

  try {
    // Initialize the SDK
    const genAI = new GoogleGenerativeAI(apiKey);

    // FIX: Use 'gemini-1.5-flash' - if this still fails, try 'gemini-1.5-flash-001'
    const model = genAI.getGenerativeModel({   model: "models/gemini-2.5-flash" });

    const prompt = `You are a professional Telugu school textbook translator.
Context: I am a Physical Science teacher for 10th class based on the Andhra Pradesh syllabus.

Rules:
- Translate the following English text into Telugu.
- Use technical terminology appropriate for 10th Class Physical Science.
- Preserve question numbers, marks (e.g., 5M, 10M), and all formatting.
- Output ONLY the translated Telugu text.
- DO NOT add extra explanations.

Text to translate:
${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const teluguText = response.text();
    
    console.log(`✅ Translation successful!`);
    return teluguText.trim();

  } catch (err) {
    console.error(`❌ Translation failed:`, err.message);
    // Returning the error message so you can see it in Postman
    return `Translation Error: ${err.message}`; 
  }
}

module.exports = translateToTelugu;