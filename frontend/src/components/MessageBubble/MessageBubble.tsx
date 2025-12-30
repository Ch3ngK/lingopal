import React from "react";
import styles from "./MessageBubble.module.css";

interface MessageBubbleProps {
    text: string; 
    sender: "user" | "ai";
    correction?: string; 
    followUp?: string; 
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  text, 
  sender, 
  correction,
  followUp
}) => {
    const bubbleStyle = 
        sender === "user"
            ? styles.userBubble
            : styles.aiBubble;
    
    return (
    <div className={`max-w-xs p-2 rounded-md my-1 ${bubbleStyle}`}>
      <span>{text}</span>
      {correction && ( //basically works like an if-else statement(truthy and falsy)
        <span className={styles.correction}>
          {correction}
          </span>
          )}

      {followUp && (
        <div className={styles.followUp}>
          {followUp}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;