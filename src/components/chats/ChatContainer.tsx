import { useSearchParams } from "react-router-dom";

import ChannelsList from "./ChannelsList";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { useGetChannels } from "@/queries/channels";

const ChatContainer = () => {
  const [searchParams] = useSearchParams();
  const cId: string = searchParams.get("cId") || "";
  const { data: channels, isFetching } = useGetChannels();

  return (
    <div className="flex h-full">
      <ChannelsList channels={channels?.data || []} isFetching={isFetching} />
      <div className="flex flex-col h-[calc(100vh-4rem)] w-full mx-auto border rounded shadow-sm">
        <ChatHeader channelId={cId} />
        <MessageList channelId={cId} />
        <MessageInput channelId={cId} />
      </div>
    </div>
  );
};

export default ChatContainer;
