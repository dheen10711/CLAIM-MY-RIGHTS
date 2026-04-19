import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

/**
 * Detect language from user input
 */
function detectLanguage(text = "") {
  // Tamil Unicode range
  if (/[\u0B80-\u0BFF]/.test(text)) return "Tamil";
  // Hindi (Devanagari) Unicode range
  if (/[\u0900-\u097F]/.test(text)) return "Hindi";
  // Default
  return "English";
}

export async function askGemini(userPrompt) {
  try {
    const language = detectLanguage(userPrompt);

    const finalPrompt = `
You are a legal assistance AI for an Indian platform called Claim My Rights.

IMPORTANT RULES (STRICT):
- Detect the user's language.
- Respond ONLY in ${language}.
- Do NOT mix languages.
- Use simple, clear, easy-to-understand words.
- If the response is long, use points or steps.

User Input:
${userPrompt}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: finalPrompt
    });

    return response.text;

  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
