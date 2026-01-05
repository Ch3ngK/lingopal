// index.ts
import "dotenv/config";   // Load environment variables FIRST
import express from "express";
import cors from "cors";
import { getAIResponse } from "./services/aiRouter.js";

// Test env variable
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? 
  `✅ loaded (${process.env.OPENAI_API_KEY.substring(0, 8)}...)` : 
  "❌ missing");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { text, language } = req.body;

  try {
    const response = await getAIResponse(text, language);
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed", details: err });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`AI server running on http://localhost:${PORT}`);
});