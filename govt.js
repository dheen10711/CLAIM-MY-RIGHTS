import express from "express";
import { askGemini } from "../gemini.js";
import { getFallback } from "../fallback.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { category, state, issue, language } = req.body;

    if (!category || !state || !issue) {
        return res.status(400).json({
            result: "Please provide your details or issue."
        });
    }

    let langInstruction = "Respond in English";
    if (language === "ta-IN") langInstruction = "Respond in Tamil";
    else if (language === "hi-IN") langInstruction = "Respond in Hindi";

    const prompt = `
You are a government legal aid advisor in India.

${langInstruction}

Category: ${category}
State: ${state}
Issue: ${issue}

Provide:
- Schemes
- Eligibility
- Authorities
- Steps
`;

    try {
        const response = await askGemini(prompt);
        res.json({ result: response });

    } catch (error) {
        console.log("⚠️ Gemini failed → fallback used");

        const fallback = getFallback("govt", { category, state, issue }, language);
        res.json({ result: fallback });
    }
});

export default router;