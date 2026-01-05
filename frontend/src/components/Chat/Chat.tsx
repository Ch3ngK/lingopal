import React, { useState, useEffect, useRef } from "react";
import MessageBubble from "../MessageBubble/MessageBubble";
import styles from "./Chat.module.css";

type Language = "english" | "mandarin" | "cantonese" | "thai";

interface Message {
  text: string;
  sender: "user" | "ai";
  correction?: string;
  followUp?: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<Language>("english");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset chat when language changes
  useEffect(() => {
    setMessages([]);
  }, [language]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setInput("");
    setIsTyping(true);

    try {
      const aiResponse = await sendMessageToAI(userMessage, language);

      setMessages((prev) => [
        ...prev,
        {
          text: aiResponse.text || "AI failed",
          correction: aiResponse.correction,
          followUp: aiResponse.followUp,
          sender: "ai",
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { text: "AI failed", sender: "ai" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  async function sendMessageToAI(message: string, language: Language) {
    const response = await fetch("http://localhost:3001/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message, language }),
    });

    if (!response.ok) {
      throw new Error("AI request failed");
    }

    return response.json();
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            text={msg.text}
            sender={msg.sender}
            correction={msg.correction}
            followUp={msg.followUp}
          />
        ))}
        {isTyping && (
          <div className={styles.typingIndicator}>
            LingoPal is typing
            <span className={styles.dot}>.</span>
            <span className={styles.dot}>.</span>
            <span className={styles.dot}>.</span>
          </div>
        )}
        <div ref={messagesEndRef} />
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
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className={styles.languageSelect}
          >
            <option value="english">English 🇬🇧</option>
            <option value="mandarin">Mandarin 🇨🇳</option>
            <option value="cantonese">Cantonese 🇭🇰</option>
            <option value="thai">Thai 🇹🇭</option>
          </select>
          <button className={styles.sendButton} type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
