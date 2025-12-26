// src/components/FrontPage.tsx
import React from "react";

interface FrontPageProps {
  onStart: () => void;
}

const FrontPage: React.FC<FrontPageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-100 to-blue-50 p-4">
      <h1 className="text-5xl font-bold mb-4 text-blue-700">Lingopal</h1>
      <p className="text-lg mb-8 text-gray-700">
        Your daily AI language conversation buddy
      </p>
      <button
        onClick={onStart}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition"
      >
        Start Chatting
      </button>
      <div className="mt-10 text-center text-gray-600">
        <p>Practice Mandarin, Cantonese, Thai, and more — 5 minutes a day!</p>
      </div>
    </div>
  );
};

export default FrontPage;
