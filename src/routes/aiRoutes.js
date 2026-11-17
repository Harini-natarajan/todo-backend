import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

router.post("/breakdown", async (req, res) => {
    try {
        const { task } = req.body;

        if (!task || !task.trim()) {
            return res.status(400).json({
                message: "Please provide a task"
            });
        }

        const response = await ai.models.generateContent({
           model: "gemini-3.5-flash-lite",
            contents: `You are a productivity assistant.

Break this task into 4 to 6 small practical subtasks.

Task: ${task}

Return only a numbered list.
Use simple language.`
        });

        return res.status(200).json({
            message: "AI suggestions generated successfully",
            suggestions: response.text
        });

    } catch (error) {
    console.error("Gemini Error:", error);

    const errorMessage = error.message || "";

    if (
        error.status === 503 ||
        errorMessage.includes("503") ||
        errorMessage.includes("UNAVAILABLE")
    ) {
        return res.status(503).json({
            message: "Gemini is temporarily busy. Please try again in a few seconds."
        });
    }

    return res.status(500).json({
        message: "Failed to generate AI suggestions",
        error: errorMessage
    });
}
});

export default router;