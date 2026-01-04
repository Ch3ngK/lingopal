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
You are a friendly language learning partner.

Language: ${language}
User message: ${message}

Respond in JSON:
{
  "text": "...",
  "correction": "...",
  "followUp": "..."
}
        `,
      }),
    }
  );

  const data = await response.json();

  // Hugging Face returns raw text — extract JSON safely
  const rawText = data?.[0]?.generated_text || "";

  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      text: "Tell me more 😊",
      correction: "",
      followUp: "",
    };
  }

  return JSON.parse(jsonMatch[0]);
}

//-------------Smart Fallback------------------
export async function getAIResponse(message: string, language: string) {
  try {
    console.log("Trying OpenAI...");
    return await callOpenAI(message, language); 
  } catch (err) {
    console.warn("OpenAI failed, falling back to Hugging Face:");
    return await callHuggingFace(message, language); 
  }
}