import express from "express";
import { askGemini } from "../gemini.js";
import { getFallback } from "../fallback.js";  // ✅ IMPORTANT

const router = express.Router();

router.post("/", async (req, res) => {
    const { problem, language } = req.body;

    if (!problem) {
        return res.status(400).json({
            result: "Problem description is required."
        });
    }

    // Language mapping
    let langInstruction = "Respond in English using simple words";
    if (language === "ta-IN") langInstruction = "Respond in Tamil using simple words";
    else if (language === "hi-IN") langInstruction = "Respond in Hindi using simple words";

    const prompt = `
You are an expert Indian legal advisor on a platform called Claim My Rights.

IMPORTANT INSTRUCTIONS:
- ${langInstruction}.
- Do NOT mix languages.
- Explain clearly for a common person in India.

User problem:
${problem}

Provide:
1. Applicable Indian laws
2. Explanation in simple language
3. Rights of the user
4. Step-by-step legal solution
5. Precautions
`;

    try {
        const response = await askGemini(prompt);
        res.json({ result: response });

    } catch (error) {
        console.log("⚠️ Gemini failed → fallback used");

        const fallback = getFallback("legal", { problem }, language);
        res.json({ result: fallback });
    }
});

export default router;