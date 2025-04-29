import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateMessage } from "@/queries/messages";
import { getSocket } from "@/utils/socket";
import { useUser } from "@clerk/clerk-react";

const MessageInput = ({ channelId }: { channelId: string }) => {
  const { user } = useUser();
  const [text, setText] = useState("");
  const { mutateAsync: createMessage, isPending } = useCreateMessage();

  const sendMessage = async () => {
    if (!text.trim()) return;

    const socket = getSocket();
    if (!socket) return;

    const messageData = {
      content: text,
      channelId: channelId,
      senderId: user?.id,
    };

    const message = {
      text,
      sender: messageData,
      self: true,
      channelId,
    };

    await createMessage({ channelId, content: text });
    socket.emit("send-message", message);
    setText("");
  };

  return (
    <div className="flex items-center gap-2 border-t p-4">
      <Input
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <Button onClick={sendMessage} disabled={isPending}>
        {isPending ? "Sending..." : "Send"}
      </Button>
    </div>
  );
};

export default MessageInput;
