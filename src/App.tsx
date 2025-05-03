import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import ChatContainer from "./components/chats/ChatContainer";

import './App.css'

function App({ showChatRoute }: { showChatRoute: boolean }) {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          {showChatRoute && <Route path="/chats" element={<ChatContainer />} />}
          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
