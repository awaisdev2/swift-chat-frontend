import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";

import App from "./App";
import { initSocket } from "./utils/socket";

function AppWithSocket() {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const init = async () => {
      const token = await getToken();
      if (token && isSignedIn) {
        initSocket(token);
      }
    };
    init();
  }, [getToken, isSignedIn]);

  return <App />;
}

export default AppWithSocket;
