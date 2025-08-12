import { FC, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import dayjs from "dayjs";
import { Dot, Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MessageItemProps } from "@/utils/messages.type";
import RenderFileIcon from "@/common/RenderFileIcon";
import { useDeleteMessage } from "@/queries/messages";
import ConfirmationModal from "@/common/ConfirmationModal";
import MessageInput from "./MessageInput";

const MessageItem: FC<MessageItemProps> = ({ message }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useUser();
  const isRecipientUser = user?.id === message.created_by;

  const { mutateAsync: deleteMessage } = useDeleteMessage();

  const handleDeleteMessage = async () => {
    try {
      await deleteMessage({
        channelId: message.channel_id,
        messageId: message.id.toString(),
      });
      setShowDeleteConfirm(false);
    } catch (error) {
      console.log(error);
    }
  };

  const formatMessage = (messageContent: string) => {
    const messages = messageContent?.split(" ");
    return messages?.map((_message, index) => {
      if (_message.startsWith("http://") || _message.startsWith("https://")) {
        return (
          <a
            className={`${
              isRecipientUser ? "text-white" : "text-black"
            } hover:underline`}
            key={index}
            href={_message}
            target="_blank"
            rel="noopener noreferrer"
          >
            {index === 0 ? _message : ` ${_message}`}
          </a>
        );
      } else {
        return (
          <span className="white-space-pre-line" key={index}>
            {index === 0 ? _message : ` ${_message}`}
          </span>
        );
      }
    });
  };
  return (
    <>
      {(message.attachments || message.content) && (
        <div
          className={`flex ${
            isRecipientUser ? "justify-end" : "justify-start"
          } px-4 py-2`}
        >
          <div
            className={`flex items-center ${
              isRecipientUser ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <img
              src={message.users?.image || "/assets/blank.png"}
              alt="User Avatar"
              className={`w-8 h-8 rounded-full object-cover ${
                isRecipientUser ? "ml-2" : "mr-2"
              }`}
            />

            <div className="relative">
              <div
                className={`p-3 rounded-xl max-w-md ${
                  isRecipientUser
                    ? "bg-[#1E2938] text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {!isEditing && message.deleted_at && (
                  <p className="text-sm">This message was deleted</p>
                )}
                {!isEditing && !message.deleted_at && (
                  <>
                    <p className="text-sm mr-4 mb-2">
                      {formatMessage(message.content)}
                    </p>

                    {message.attachments &&
                      message?.attachments?.length > 0 && (
                        <RenderFileIcon
                          fileType={message.attachments?.[0].file_type}
                          attachmentUrl={message.attachments?.[0].url}
                          className={`h-28 rounded-lg ${
                            message.attachments?.[0].file_type?.startsWith(
                              "image/"
                            )
                              ? "w-40"
                              : "w-24"
                          }`}
                          messagesAttachment
                        />
                      )}
                  </>
                )}

                {!isEditing && isRecipientUser && !message.deleted_at && (
                  <div className="absolute top-0 right-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-full text-gray-100">
                          <Ellipsis size={16} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem onClick={() => setIsEditing(true)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setShowDeleteConfirm(true)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

                {isEditing && (
                  <MessageInput
                    channelId={message.channel_id}
                    message={message}
                    setIsEditing={setIsEditing}
                  />
                )}

                <span className="text-xs flex items-center justify-end mt-1 text-right font-semibold">
                  {message.users?.name} <Dot />{" "}
                  {dayjs(message.deleted_at || message.created_at).fromNow()}
                </span>
              </div>
            </div>
          </div>
          {showDeleteConfirm && (
            <ConfirmationModal
              isOpen={showDeleteConfirm}
              title="Delete Message"
              description="Are you sure you want to delete this message?"
              onConfirm={handleDeleteMessage}
              onCancel={() => setShowDeleteConfirm(false)}
            />
          )}
        </div>
      )}
    </>
  );
};

export default MessageItem;
