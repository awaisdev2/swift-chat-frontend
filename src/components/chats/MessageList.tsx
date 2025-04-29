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

  useEffect(() => {
    if (isSuccess) {
      setMessages(fetchedMessages?.data || []);
    }
  }, [isSuccess, fetchedMessages]);

  useEffect(() => {
    if (!socket || !channelId) return;

    const handleReceive = (msg: ChatMessage) => {
      if (msg.channelId === channelId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive-message", handleReceive);
    return () => {
      socket.off("receive-message", handleReceive);
    };
  }, [socket, channelId]);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  if (!channelId)
    return <div className="flex-1 p-4">Select a channel to view messages</div>;

  return (
    <div ref={listRef} className="flex-1 overflow-y-auto bg-white p-4">
      {messages && messages?.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}
    </div>
  );
};

export default MessageList;
