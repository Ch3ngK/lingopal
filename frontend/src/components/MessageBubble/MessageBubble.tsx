import React from "react";

interface MessageBubbleProps {
    text: string; 
    sender: "user" | "ai";
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, sender}) => {
    const bubbleStyle = 
        sender === "user"
            ? "bg-blue-500 text-white self-end"
            : "bg-gray-300 text-black self-start";
    
    return (
    <div className={`max-w-xs p-2 rounded-md my-1 ${bubbleStyle}`}>
      {text}
    </div>
  );
};

export default MessageBubble;