import React, { useState, useEffect } from "react";
import MessageBubble from "../MessageBubble/MessageBubble";
import styles from "./Chat.module.css";

const Chat: React.FC = () => { //Readct.FC stands for React Functional Component
  const [messages, setMessages] = useState<{ 
    text: string; 
    sender: "user" | "ai"; 
    correction?: string;
    followUp?: string;
   }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [language,setLanguage] = useState<"english" | "mandarin" | "cantonese" | "thai">("english");
  
  //Reset chat after changing language
  useEffect(() => {
    const el = document.getElementById('chatContainer');
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    setMessages([]);
  }, [language]);

  const handleSend = async () => {
    if (!input.trim()) return; //if input is empty, do nothing 

    // Add user message to the chat history
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);

    // Clear input
    const userMessage = input;
    setInput("");

    //Show typing indicator 
    setIsTyping(true); 

    try {
      const aiResponse = await sendMessageToAI(userMessage, language); 

      setMessages(prev => [
        ...prev,
        {
          text: aiResponse.text || "AI failed", 
          correction: aiResponse.correction,
          followUp: aiResponse.followUp,
          sender: "ai",
        }
      ]);
    } catch (err) {
      console.error(err); 
      setMessages(prev => [...prev, { text: "AI failed", sender: "ai"}]);
    } finally {
      setIsTyping(false); 
    }
  };

  async function sendMessageToAI(message: string, language: string) {
  const response = await fetch("http://localhost:3001/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: message, language }),
  });

  return response.json();
}


  return (
    <div id ="chatContainer" className={styles.chatContainer}>
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
          onChange={(e) => setLanguage(e.target.value as any)}
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

