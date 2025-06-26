import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENROUTER_API_KEY;

app.post("/bmi-advice", async (req, res) => {
  const { bmi, category } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemma-3n-e4b-it:free", // Or use "openchat/openchat-7b:free" for faster responses
        messages: [
          {
            role: "user",
            content: `My BMI is ${bmi} and I fall in the ${category} category.

Act like a supportive and professional fitness expert. Start with a brief motivational message, then give me a simple, practical routine.

1. ✅ Start with 2-3 encouraging lines — be friendly and make me feel like I'm on the right path.
2. ✅ Give Top 3 exercises I should do — use short bullet points with clear, one-line descriptions.
3. ✅ Give a 1-day balanced diet plan — divide it into breakfast, lunch, dinner, and snack.

Tone: Positive, supportive, clear, and professional. Keep it concise and easy to follow. No disclaimers, no repetition, no intro about BMI.`
          }
        ]
      })
    });

    const data = await response.json();

    const advice = data.choices?.[0]?.message?.content || "⚠️ No advice generated.";
    res.json({ advice });
  } catch (error) {
    console.error("OpenRouter Error:", error);
    res.status(500).json({ advice: "⚠️ AI service failed via OpenRouter." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
