import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import ChatContainer from "./components/chats/ChatContainer";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chats" element={<ChatContainer />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
