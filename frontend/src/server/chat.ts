import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // Node reads this
});

export async function getAIResponse(message: string, language: string) {
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
