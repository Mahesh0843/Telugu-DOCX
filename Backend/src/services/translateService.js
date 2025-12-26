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
Context:
I am a Physical Science (Physics + Chemistry) teacher for 10th class,
following the Andhra Pradesh State Board syllabus.

Rules:
- Translate the given English text into **clear, accurate Telugu**.
- Use **standard technical terminology** suitable for **10th Class Physical Science**.
- **Preserve question numbers, sub-questions, marks** (e.g., 1M, 5M, 10M), and **original formatting** exactly.
- If marks are present, keep them in a **professional question-paper format**.
- Do NOT add, remove, summarize, or explain anything.
- Output **ONLY** the translated Telugu text.
- Do NOT include headings, notes, or extra commentary.

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
