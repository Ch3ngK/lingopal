import React, { useState } from "react";
import MessageBubble from "../MessageBubble/MessageBubble";
import styles from "./Chat.module.css";

const Chat: React.FC = () => { //Readct.FC stands for React Functional Component
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "ai"; correction?: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const generateFakeAIResponse = (userText: string) => {
    if (userText.toLowerCase().includes("go play games")) {
      return {
        text:"You're almost there 😊 Corrected: ",
        correction: "I went to play video games. What kind of games did you play?"
      };
    }
    if (userText.toLowerCase().includes("你好")) {
      return { text: "很好！你今天过得怎么样？", correction: "" };
    }

    return { text: "Nice! Tell me more!", correction: "" }; 
  }; 

  const handleSend = () => {
    if (!input.trim()) return; //if input is empty, do nothing 

    // Add user message to the chat history
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);

    // Clear input
    const userMessage = input;
    setInput("");

    // Hardcoded AI reply for now
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { ...generateFakeAIResponse(userMessage), sender: "ai" },
      ]);
    }, 500); // small delay for realism

    setIsTyping(true); 

    setTimeout(() => {
      setMessages((prev) => [
        ...prev, 
        {...generateFakeAIResponse(userMessage), sender: "ai"},
      ]);
      setIsTyping(false); 
    }, 1000);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <MessageBubble 
          key={index} 
          text={msg.text} 
          correction={msg.correction}
          sender={msg.sender} 
          />
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

