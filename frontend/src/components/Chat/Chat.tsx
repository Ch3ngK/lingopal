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
    setMessages([]);
  }, [language]);

  const generateFakeAIResponse = (userText: string) => {
    const text = userText.toLowerCase();
    if (language === "english") {
      if (text.includes("go play games")) {
        return {
          text:"You're almost there 😊 Corrected: ",
          correction: "I went to play video games." ,
          followUp: "What kind of games did you play?"
        };
      }
    }

    if (language === "mandarin") {
      if (text.includes("你好")){
        return { text: "很好！你今天过得怎么样？", correction: "" };
      }
      if (text.includes("去玩游戏")) {
        return {
          text: "你几乎正确 😊 修改: ",
          correction: "我去玩了游戏。",
          followUp: "你玩了什么游戏？"
        };
      }
      return { text: "我们继续聊天吧 😊" };
    }

    if(language === "thai") {
      if (text.includes("ไปเล่นเกม")) {
        return {
          text: "เกือบถูกแล้ว 😊 แก้ไข: ",
          correction: "ฉันไปเล่นเกมส์",
          followUp: "คุณเล่นเกมอะไรบ้าง?"
        };
      }
      return {text: "ดีมาก! วันนี้เป็นยังไงบ้าง?" };
    }

    if(language === "cantonese") {
      if (text.includes("去玩遊戲")) {
        return {
          text: "你幾乎啱 😊 修改: ",
          correction: "我去咗打機。",
          followUp: "你打咗咩遊戲？"
        };
      }
      return {text: "唔錯呀！你今日點呀？" };
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

    //Show typing indicator 
    setIsTyping(true); 

    // Hardcoded AI reply for now
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

