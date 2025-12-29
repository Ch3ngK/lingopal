import React from "react";
import styles from "./MessageBubble.module.css";

interface MessageBubbleProps {
    text: string; 
    sender: "user" | "ai";
    correction?: string; 
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, sender, correction}) => {
    const bubbleStyle = 
        sender === "user"
            ? styles.userBubble
            : styles.aiBubble;
    
    return (
    <div className={`max-w-xs p-2 rounded-md my-1 ${bubbleStyle}`}>
      <span>{text}</span>
      {correction && (
        <span className={styles.correction}>
          {correction}
          </span>
          )}
    </div>
  );
};

export default MessageBubble;