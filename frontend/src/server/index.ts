import "dotenv/config";   // ✅ must be first to load env variables
import express from "express";
import cors from "cors";
import { getAIResponse } from "./chat";

const app = express();
app.use(cors());          // allow frontend requests
app.use(express.json());  // parse JSON body

// Test env variable
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "✅ loaded" : "❌ missing");

// API endpoint for chat
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

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`AI server running on http://localhost:${PORT}`);
});
