import { io, Socket } from "socket.io-client";

let socket: Socket;

export const initSocket = (token: string) => {
  socket = io(import.meta.env.VITE_API_URL || "http://localhost:6011", {
    withCredentials: true,
    transports: ["websocket"],
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.warn("❌ Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("🚫 Socket connection error:", err.message);
  });

  return socket;
};

export const getSocket = () => socket;
