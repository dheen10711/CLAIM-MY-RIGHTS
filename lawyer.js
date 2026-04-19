import express from "express";
import { askGemini } from "../gemini.js";
import { getFallback } from "../fallback.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { problem, location, language } = req.body;

    if (!problem || !location) {
        return res.status(400).json({
            result: "Missing legal problem or location."
        });
    }

    let langInstruction = "Respond in English";
    if (language === "ta-IN") langInstruction = "Respond in Tamil";
    else if (language === "hi-IN") langInstruction = "Respond in Hindi";

    const prompt = `
You are a legal assistant.

${langInstruction}

Problem: ${problem}
Location: ${location}

Suggest:
- Lawyers
- NGOs
- Contact details
`;

    try {
        const result = await askGemini(prompt);
        res.json({ result });

    } catch (error) {
        console.log("⚠️ Gemini failed → fallback used");

        const fallback = getFallback("lawyer", { location }, language);
        res.json({ result: fallback });
    }
});

export default router;