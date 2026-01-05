export async function sendMessage(message: string, language: string) {
  const res = await fetch("http://localhost:3001/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: message, language }),
  });

  return res.json();
}
