import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import Header from "./components/Header";
import Home from "./components/Home";
import ChatContainer from "./components/chats/ChatContainer";

import "./App.css";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return isSignedIn ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/chats"
          element={
            <PrivateRoute>
              <ChatContainer />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
