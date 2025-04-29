import { useSearchParams } from "react-router-dom";

import ChannelsList from "./ChannelsList";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { useCreateChannel, useGetChannels } from "@/queries/channels";

const ChatContainer = () => {
  const [searchParams] = useSearchParams()
  const cId: string = searchParams.get('cId') || ''
  const { data: channels } = useGetChannels();
  const { mutateAsync: createChannel } = useCreateChannel();

  const onCreateChannel = async (name: string, roomId: string) => {
    try {
      await createChannel({ name, roomId });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-full">
      <ChannelsList
        channels={channels?.data || []}
        onCreateChannel={onCreateChannel}
      />
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto border rounded shadow-sm">
        <ChatHeader />
        <MessageList channelId={cId} />
        <MessageInput channelId={cId} />
      </div>
    </div>
  );
};

export default ChatContainer;
