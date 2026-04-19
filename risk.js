import express from "express";
import { askGemini } from "../gemini.js";
import { getFallback } from "../fallback.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { issue, language } = req.body;

    if (!issue) {
        return res.status(400).json({
            result: "Please provide an issue for risk analysis."
        });
    }

    let langInstruction = "Respond in English using simple words";
    if (language === "ta-IN") langInstruction = "Respond in Tamil using simple words";
    else if (language === "hi-IN") langInstruction = "Respond in Hindi using simple words";

    const prompt = `
You are a legal risk analysis expert for a platform called Claim My Rights.

IMPORTANT INSTRUCTIONS:
- ${langInstruction}
- Use simple language
- Do not mix languages

Analyze:
${issue}

Provide:
1. Risk level
2. Financial risk
3. Legal consequences
4. Chances of success
5. Recommendation
`;

    try {
        const response = await askGemini(prompt);
        res.json({ result: response });

    } catch (error) {
        console.log("⚠️ Gemini failed → fallback used");

        const fallback = getFallback("risk", { issue }, language);
        res.json({ result: fallback });
    }
});

export default router;