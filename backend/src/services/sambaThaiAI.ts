import SambaNova from "sambanova";

const client = new SambaNova({
  baseURL: process.env.SAMBA_BASE_URL!, // e.g. https://api.sambanova.ai/v1
  apiKey: process.env.SAMBA_API_KEY!,
});

export async function callSambaThai(message: string) {
    const response: any = await client.chat.completions.create({
    model: "Meta-Llama-3.3-70B-Instruct",
    messages: [
        {
        role: "system",
        content:
            "You are a friendly Thai grammar teacher. Correct grammar only if needed, reply naturally, and ask ONE short follow-up question. Output EXACTLY:\nCorrected: <sentence or NONE>\nReply: <text>\nQuestion: <text>",
        },
        { role: "user", content: message },
    ],
    });

    const choice = response.choices?.[0];
    const content = choice?.message?.content || "";


  // parse structured text like:
  // Corrected: …
  // Reply: …
  // Question: …
  const lines = content.split("\n").map((l: string) => l.trim()).filter(Boolean);

  let correction = "";
  let text = "";
  let followUp = "";

  for (const line of lines) {
    if (line.toLowerCase().startsWith("corrected:")) {
      correction = line.replace(/corrected:/i, "").trim();
    }
    if (line.toLowerCase().startsWith("reply:")) {
      text = line.replace(/reply:/i, "").trim();
    }
    if (line.toLowerCase().startsWith("question:")) {
      followUp = line.replace(/question:/i, "").trim();
    }
  }

  return { text, correction, followUp };
}

