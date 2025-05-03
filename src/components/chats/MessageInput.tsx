import { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Smile } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCreateMessage } from "@/queries/messages";
import { getSocket } from "@/utils/socket";
import { useUser } from "@clerk/clerk-react";

type EomjiMartProps = {
  id: string;
  shortcodes: string;
  native: string;
  name: string;
  unified: string;
  keywords: string[];
};

const MessageInput = ({ channelId }: { channelId: string }) => {
  const { user } = useUser();
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { mutateAsync: createMessage, isPending } = useCreateMessage();

  const addEmoji = (emoji: EomjiMartProps) => {
    setText((prev) => prev + emoji.native);
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    const socket = getSocket();
    if (!socket) return;

    const messageData = {
      content: text,
      channelId: channelId,
      senderId: user?.id,
      name: user?.fullName,
      image: user?.imageUrl,
      email: user?.emailAddresses,
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
    <div className="flex flex-col border-t p-4">
      {showEmojiPicker && (
        <div className="mb-2 absolute bottom-20 right-20">
          <Picker
            data={data}
            //onClickOutside={() => setShowEmojiPicker((prev) => !prev)}
            theme="light"
            onEmojiSelect={addEmoji}
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="w-full">
          <div className="relative bg-gray-50 border block w-full px-4 border-gray-300 text-gray-900 text-sm rounded-lg">
            <input
              type="text"
              value={text}
              className="w-[95%] outline-none border-0 ring-0 p-2"
              placeholder="Enter your message here"
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <div className="absolute inset-y-0 end-0 flex items-center px-3.5">
              <Button
                type="button"
                className="px-2"
                size="sm"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              >
                <Smile />
              </Button>
            </div>
          </div>
        </div>
        <Button type="submit" onClick={sendMessage} disabled={isPending}>
          {isPending ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
