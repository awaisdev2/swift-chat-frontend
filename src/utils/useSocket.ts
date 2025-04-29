import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { initSocket } from "@/utils/socket";
import { Socket } from "socket.io-client";

export const useSocket = (): Socket | null => {
  const { getToken, isSignedIn } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const setup = async () => {
      if (isSignedIn) {
        const token = await getToken();
        if (token) {
          const initialized = initSocket(token);
          setSocket(initialized);
        }
      }
    };
    setup();
  }, [getToken, isSignedIn]);

  return socket;
};
