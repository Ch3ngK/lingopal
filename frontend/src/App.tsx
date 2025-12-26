// src/App.tsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./components/Chat/Chat";
import FrontPage from "./components/FrontPage/FrontPage";

function App() {
  return (
    <Router> 
      <Routes> 
        <Route path="/" element={<FrontPage />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
