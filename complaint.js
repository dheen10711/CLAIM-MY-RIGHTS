import express from "express";
import { askGemini } from "../gemini.js";
import { getFallback } from "../fallback.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { issue, language } = req.body;

    if (!issue) {
        return res.status(400).json({
            result: "Issue description is required."
        });
    }

    let langInstruction = "Respond in English";
    if (language === "ta-IN") langInstruction = "Respond in Tamil";
    else if (language === "hi-IN") langInstruction = "Respond in Hindi";

    const prompt = `
You are a legal document drafting assistant in India.

${langInstruction}

User issue:
${issue}

Generate a proper complaint with:
- To
- Subject
- Description
- Request
- Closing
`;

    try {
        const response = await askGemini(prompt);
        res.json({ result: response });

    } catch (error) {
        console.log("⚠️ Gemini failed → fallback used");

        const fallback = getFallback("complaint", { issue }, language);
        res.json({ result: fallback });
    }
});

export default router;