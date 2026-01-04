//Helpers
function needsPastTenseFix(message: string): boolean {
  return (
    /yesterday|last\s(night|week|year)|ago/i.test(message) &&
    /\b(go|eat|play|study|walk)\b/i.test(message)
  );
}

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // Node reads this
});

//-------------------OpenAI--------------------
export async function callOpenAI(message: string, language: string) {
  const prompt = `You are a helpful language learning assistant.

Language: ${language}
User message: ${message}

Rules:
- Correct grammar only if needed
- Highlight only the corrected part
- Ask ONE short follow-up question
- Sound natural, like a friend.

Return JSON only: 
{
  "text": "...",
  "correction": "...",
  "followUp": "..."
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
  });

  return JSON.parse(completion.choices[0].message.content || "{}");
}

//--------------------Hugging Face----------------
async function callHuggingFace(message: string, language: string) {
  const forceCorrection = needsPastTenseFix(message);
  const instruction = forceCorrection
    ? "The sentence IS grammatically incorrect. You MUST correct it."
    : "Check if the sentence is grammatically incorrect.";

  const response = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `
You are a grammar correction assistant.

${instruction}

Respond using EXACTLY this format and nothing else:

Corrected: <corrected sentence OR NONE>
Reply: <natural reply>
Question: <one short question>

Rules:
- If incorrect, Corrected MUST NOT be NONE
- If correct, write NONE
- Do NOT repeat the input sentence

Language: ${language}
User message: ${message}

        `,
      }),
    }
  );

 const data = await response.json();
const rawText: string = data?.[0]?.generated_text || "";

// Split lines and trim
const lines = rawText.split("\n").map(l => l.trim()).filter(Boolean);

let correction = "";
let followUp = "";
let text = "";

// Heuristic parsing: look for likely corrections
for (const line of lines) {
  const l = line.toLowerCase();

  // Check for corrected sentence (English example)
  if (
    l.includes("corrected:") ||
    l.includes("改") ||
    l.includes("แก้") ||
    /i went|i have|i am|i did/i.test(line)
  ) {
    correction = line.replace(/Corrected:|改|แก้/gi, "").trim();
  }

  // Look for a question
  if (line.includes("?")) followUp = line;

  // Otherwise treat as text
  if (!text && !line.toLowerCase().includes("corrected")) text = line;
}

// If nothing parsed, fallback
return {
  text: text || "Sounds good 😊",
  correction,
  followUp,
};


}


//-------------Smart Fallback------------------
export async function getAIResponse(message: string, language: string) {
  try {
    console.log("➡️ Trying OpenAI");
    const result = await callOpenAI(message, language);
    console.log("✅ OpenAI success:", result);
    return result;
  } catch (err) {
    console.error("❌ OpenAI failed:", err);

    try {
      console.log("➡️ Trying Hugging Face");
      const hfResult = await callHuggingFace(message, language);
      console.log("✅ Hugging Face success:", hfResult);
      return hfResult;
    } catch (hfErr) {
      console.error("❌ Hugging Face failed:", hfErr);
      throw hfErr;
    }
  }
}
