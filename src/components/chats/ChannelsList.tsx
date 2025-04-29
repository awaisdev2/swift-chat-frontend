import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

interface Channel {
  id: string;
  name: string;
}

interface ChannelsListProps {
  channels: Channel[];
  onCreateChannel: (name: string) => void;
}

const ChannelsList: React.FC<ChannelsListProps> = ({
  channels,
  onCreateChannel,
}) => {
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChannelSelect = (id: string) => {
    setActiveChannel(id);
    navigate(`?cId=${id}`);
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleCreateChannel = async () => {
    const name = prompt("Enter new channel name:");
    if (name?.trim()) {
      onCreateChannel(name.trim());
    }
  };

  return (
    <>
      <div
        className={clsx(
          "flex-col w-full max-w-[300px] bg-gray-800 text-white transition-transform duration-300",
          isSidebarOpen ? "block" : "hidden md:block"
        )}
      >
        <div className="p-4 bg-gray-900 flex justify-between items-center">
          <h3 className="text-xl font-bold">Channels</h3>
          <Button onClick={handleCreateChannel} className="bg-green-500">
            Create
          </Button>
        </div>
        <div className="overflow-auto flex-grow">
          <ul className="space-y-2 p-4">
            {channels.map((channel) => (
              <li
                key={channel.id}
                className={clsx(
                  "p-2 rounded-md cursor-pointer hover:bg-gray-700 transition-all",
                  activeChannel === channel.id && "bg-gray-700"
                )}
                onClick={() => handleChannelSelect(channel.id)}
              >
                {channel.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button onClick={toggleSidebar} className="bg-blue-500">
          Channels
        </Button>
      </div>
    </>
  );
};

export default ChannelsList;
