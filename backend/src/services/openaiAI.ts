import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function callOpenAI(message: string, language: string) {
  const prompt = `
You are a language tutor.

Language: ${language}
User: ${message}

Return JSON:
{
  "text": "...",
  "correction": "...",
  "followUp": "..."
}
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(res.choices[0].message.content || "{}");
}
