// src/components/FrontPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom"; 
import styles from "./FrontPage.module.css";

interface FrontPageProps {
  onStart: () => void;
}

const FrontPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lingopal</h1>
      <p className={styles.tagline}>Your daily AI language conversation buddy</p>
      <button className={styles.startButton} onClick={() => navigate("/chat")}>
        Start Chatting
      </button>
    </div>
  );
};

export default FrontPage;