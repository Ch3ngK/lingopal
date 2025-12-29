import React, { useState } from "react";
import MessageBubble from "../MessageBubble/MessageBubble";
import styles from "./Chat.module.css";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "ai" }[]>([]);
  const [input, setInput] = useState("");
  
  const generateFakeAIResponse = (userText: string) => {
    if (userText.toLowerCase().includes("go play games")) {
      return "You're almost there 😊 \nCorrected: I went to play video games. What kind of games did you play?";
    } 

    if (userText.toLowerCase().includes("你好")) {
      return "很好！你今天过得怎么样？";
    }

    return "Nice! Tell me more!"; 
  }; 

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
        { text: generateFakeAIResponse(userMessage), sender: "ai" },
      ]);
    }, 500); // small delay for realism
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <MessageBubble key={index} text={msg.text} sender={msg.sender} />
        ))}
      </div>
      <div className={styles.chatInputContainer}>
      <form
        className={styles.inputForm}
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          className={styles.inputBox}
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className={styles.sendButton} type="submit">
          Send
        </button>
      </form>
    </div>
    </div>
  );
};

export default Chat;

