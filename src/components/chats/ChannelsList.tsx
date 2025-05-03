import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Ellipsis, Pencil, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChannelForm from "./ChannelForm";
import { useDeleteChannel } from "@/queries/channels";
import ConfirmationModal from "@/common/ConfirmationModal";
import GenericModal from "@/common/GenericModal";
import ChannelsSkeletonLoader from "@/common/ChannelsSkeletonLoader";

interface Channel {
  id: string;
  name: string;
}

interface ChannelsListProps {
  channels: Channel[];
  isFetching: boolean;
}

const ChannelsList: React.FC<ChannelsListProps> = ({
  channels,
  isFetching,
}) => {
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showChannelFormDialog, setShowChannelFormDialog] =
    useState<boolean>(false);
  const [channelToDelete, setChannelToDelete] = useState<Channel | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [channelToEdit, setChannelToEdit] = useState<Channel | null>(null);
  const navigate = useNavigate();

  const { mutateAsync: deleteChannel, isPending: isDeleting } =
    useDeleteChannel();

  const handleChannelSelect = (id: string) => {
    setActiveChannel(id);
    navigate(`?cId=${id}`);
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const openCreateModal = () => {
    setChannelToEdit(null);
    setShowChannelFormDialog(true);
  };

  const openEditModal = (channel: Channel) => {
    setChannelToEdit(channel);
    setShowChannelFormDialog(true);
  };

  const closeModal = () => {
    setChannelToEdit(null);
    setShowChannelFormDialog(false);
  };

  const handleDeleteClick = (channel: Channel) => {
    setChannelToDelete(channel);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (channelToDelete) {
      await deleteChannel({ channelId: channelToDelete.id });
      setChannelToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setChannelToDelete(null);
    setShowDeleteConfirm(false);
  };

  useEffect(() => {
    if (channels?.length > 0) {
      navigate(`?cId=${channels[0]?.id}`);
      setActiveChannel(channels[0]?.id);
    }
  }, [channels, navigate]);

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
          <Button
            className="bg-gray-400 hover:bg-gray-300 transition-all hover:text-black text-white"
            onClick={openCreateModal}
          >
            <Plus /> Create
          </Button>
        </div>

        <div className="overflow-auto flex-grow">
          {isFetching && <ChannelsSkeletonLoader />}

          {channels?.length !== 0 && !isFetching && (
            <ul className="space-y-2 p-4">
              {channels.map((channel) => (
                <li
                  key={channel.id}
                  className={clsx(
                    "p-2 font-medium rounded-md flex justify-between items-center transition-all",
                    activeChannel === channel.id
                      ? "bg-gray-700 text-white"
                      : "hover:bg-gray-700 text-gray-300"
                  )}
                >
                  <span
                    className="cursor-pointer w-full"
                    onClick={() => handleChannelSelect(channel.id)}
                  >
                    {channel.name}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="bg-transparent">
                      <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => openEditModal(channel)}>
                        <Pencil className="mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDeleteClick(channel)}
                      >
                        <Trash className="text-red-500 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button onClick={toggleSidebar} className="bg-blue-500">
          Channels
        </Button>
      </div>

      {showChannelFormDialog && (
        <GenericModal
          size="lg"
          isOpen={showChannelFormDialog}
          title={channelToEdit ? "Edit Channel" : "Create Channel"}
          onClose={closeModal}
        >
          <ChannelForm channelToEdit={channelToEdit} onClose={closeModal} />
        </GenericModal>
      )}

      {showDeleteConfirm && (
        <ConfirmationModal
          isOpen={showDeleteConfirm}
          title="Confirm Deletion"
          description={`Are you sure you want to delete "${channelToDelete?.name}"?`}
          confirmText="Delete"
          cancelText="Cancel"
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
          disableBtns={isDeleting}
        />
      )}
    </>
  );
};

export default ChannelsList;
