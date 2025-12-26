// src/App.tsx
import React, { useState } from "react";
import Chat from "./components/Chat/Chat";
import FrontPage from "./components/FrontPage/FrontPage";

function App() {
  const [started, setStarted] = useState(false);

  return started ? <Chat /> : <FrontPage onStart={() => setStarted(true)} />;
}

export default App;
