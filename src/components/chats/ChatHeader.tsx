import { useGetChannelById } from "@/queries/channels";

const ChatHeader = ({ channelId }: { channelId: string }) => {
  const { data: singleChannelResult } = useGetChannelById(channelId);
  return (
    <div className="p-4 border-b bg-muted text-lg font-semibold">
      #{singleChannelResult?.data[0].name}
    </div>
  );
};

export default ChatHeader;
