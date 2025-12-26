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

    const prompt = `You are a professional Telugu school textbook translator for 10th Class Andhra Pradesh State Board Physical Science (Physics + Chemistry).

**Context:**
You are translating questions exactly as they appear in the textbook/exam format.

**Strict Instructions:**
1. Translate ONLY the provided questions from English to Telugu.
2. Use precise, standard technical terminology appropriate for 10th-grade Physical Science.
3. PRESERVE ALL ORIGINAL FORMATTING exactly: question numbers (1., 2., a., b., i., ii.), marks (2M, 5M, 10M), bullet points, spacing, and any special symbols.
4. DO NOT add any extra text, explanations, instructions, headers, or comments.
5. DO NOT modify the structure, intent, or meaning of any questions.
6. Your output must contain ONLY the translated Telugu questions, nothing else.
7. If the input contains non-question content, extract and translate ONLY the question sections.

**Text to translate:**
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
