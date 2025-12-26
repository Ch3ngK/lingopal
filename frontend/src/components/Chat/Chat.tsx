import React, { useState } from "react";
import MessageBubble from "../MessageBubble/MessageBubble";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "ai" }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);

    // Clear input
    const userMessage = input;
    setInput("");

    // Hardcoded AI reply for now
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: `hello`, sender: "ai" },
      ]);
    }, 500); // small delay for realism
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <MessageBubble key={index} text={msg.text} sender={msg.sender} />
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-1 border p-2 rounded-l-md"
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 rounded-r-md"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

