import { useEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem";
import { useSocket } from "../../utils/useSocket";
import { useGetMessages } from "@/queries/messages";

type ChatMessage = {
  id: string;
  text: string;
  sender: string;
  channelId: string;
  self?: boolean;
};

interface Props {
  channelId: string;
}

const MessageList = ({ channelId }: Props) => {
  const listRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();
  const { data: fetchedMessages = [], isSuccess } = useGetMessages(channelId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Update messages when the fetched messages are available
  useEffect(() => {
    if (isSuccess) {
      setMessages(fetchedMessages?.data || []);
    }
  }, [isSuccess, fetchedMessages]);

  // Handle socket events for receiving new messages
  useEffect(() => {
    if (!socket || !channelId) return;

    const handleNewMessage = (msg: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    socket.emit("join-channel", channelId);
    console.log("📥 Joined channel", channelId);

    socket.on("receive-message", handleNewMessage);

    return () => {
      socket.emit("leave-channel", channelId);
      socket.off("receive-message", handleNewMessage);
    };
  }, [socket, channelId]);

  // Scroll to the bottom of the message list on new message
  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  if (!channelId)
    return <div className="flex-1 p-4">Select a channel to view messages</div>;

  return (
    <div ref={listRef} className="flex-1 overflow-y-auto bg-white p-4">
      {messages.length === 0 && (
        <div className="flex-1 p-4">Start a conversation!</div>
      )}
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}
    </div>
  );
};

export default MessageList;
