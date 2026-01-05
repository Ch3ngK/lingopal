// ai.ts
import OpenAI from "openai";

//-------------------Helpers-------------------
function needsPastTenseFix(message: string): boolean {
  return /yesterday|last\s(night|week|year)|ago/i.test(message) &&
         /\b(go|eat|play|study|walk)\b/i.test(message);
}

function isThai(text: string): boolean {
  return /[ก-๙]/.test(text);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

//-------------------OpenAI--------------------
export async function callOpenAI(message: string, language: string) {
  const prompt = `
You are a friendly language tutor.

Language: ${language}
User sentence: "${message}"

Instructions:
- If the sentence has any grammar mistake, unnatural phrasing, or tense error, provide a corrected sentence.
- If the sentence is already correct, write "NONE" as the corrected sentence.
- Never repeat the input sentence in your response.
- Always respond naturally and ask ONE short follow-up question.
- Return JSON ONLY in this exact format:

{
  "text": "<friendly reply>",
  "correction": "<corrected sentence or NONE>",
  "followUp": "<short follow-up question>"
}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  try {
    return JSON.parse(completion.choices[0].message.content || "{}");
  } catch {
    // fallback if parsing fails
    return {
      text: "Sounds good 😊",
      correction: "",
      followUp: "",
    };
  }
}
//-------------------Hugging Face----------------
async function callHuggingFace(message: string, language: string) {
  const forceCorrection = needsPastTenseFix(message);
  const isTH = isThai(message);

  const prompt = isTH
    ? `
คุณเป็นครูสอนภาษาไทยที่เป็นมิตรและละเอียดอ่อน

ตรวจสอบประโยคนี้:
${message}

กติกา:
- แก้ไขประโยคให้ถูกต้องและเป็นธรรมชาติ
- ลบคำซ้ำซ้อน เช่น "แล้ว" หากเกินความจำเป็น
- หากประโยคถูกต้องแล้ว ให้เขียน "NONE" ใน Corrected
- ตอบเป็นธรรมชาติ และถามคำถามสั้น ๆ หนึ่งข้อ
- ห้ามใช้ภาษาอังกฤษ

รูปแบบการตอบ (ต้องตรงตามนี้เท่านั้น):
Corrected: <ประโยคที่แก้ไขแล้ว หรือ NONE>
Reply: <คำตอบเป็นธรรมชาติ>
Question: <คำถามสั้น ๆ>
`
    : `
You are a friendly language tutor.

User message:
${message}

Rules:
- Correct grammar only if needed
- Suggest more natural phrasing if necessary
- If correct, write NONE for Corrected
- Ask ONE short follow-up question
- Output format ONLY:

Corrected: <sentence or NONE>
Reply: <natural reply>
Question: <one short question>
`;

  const response = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    }
  );

  const data = await response.json();
  const rawText: string = data?.[0]?.generated_text || "";

  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);

  let correction = "";
  let text = "";
  let followUp = "";

  for (const line of lines) {
    if (line.startsWith("Corrected:")) {
      const value = line.replace("Corrected:", "").trim();
      correction = ["NONE", "ไม่มีการแก้ไข"].includes(value) ? "" : value;
    } else if (line.startsWith("Reply:")) {
      text = line.replace("Reply:", "").trim();
    } else if (line.startsWith("Question:")) {
      followUp = line.replace("Question:", "").trim();
    }
  }

  // Force English fallback if needed
  if (!correction && forceCorrection && !isTH) {
    correction = "I went to school yesterday.";
  }

  // Default safe fallbacks
  if (!text) text = isTH ? "ดีมาก 😊" : "Sounds good 😊";
  if (!followUp) followUp = isTH ? "วันนี้ไปโรงเรียนไหม?" : "What about today?";

  return { text, correction, followUp };
}

//-------------------Smart Fallback------------------
export async function getAIResponse(message: string, language: string) {
  try {
    console.log("➡️ Trying OpenAI");
    const result = await callOpenAI(message, language);
    console.log("✅ OpenAI success:", result);
    return result;
  } catch (err) {
    console.warn("❌ OpenAI failed:", err);
    try {
      console.log("➡️ Trying Hugging Face");
      const hfResult = await callHuggingFace(message, language);
      console.log("✅ Hugging Face success:", hfResult);
      return hfResult;
    } catch (hfErr) {
      console.error("❌ Hugging Face failed:", hfErr);
      // Last-resort fallback
      return {
        text: "Sorry, I couldn't generate a response 😅",
        correction: "",
        followUp: "",
      };
    }
  }
}
