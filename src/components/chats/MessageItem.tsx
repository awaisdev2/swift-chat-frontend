import { FC } from "react";
import { useUser } from "@clerk/clerk-react";
import dayjs from "dayjs";

import { MessageItemProps } from "@/utils/messages.type";
import { Dot } from "lucide-react";

const MessageItem: FC<MessageItemProps> = ({ message }) => {
  const { user } = useUser();
  const isRecipientUser = user?.id === message.created_by;

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

        <div
          className={`p-3 rounded-xl max-w-sm ${
            isRecipientUser
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          <p className="text-sm">{formatMessage(message.content)}</p>
          <span className="text-xs flex items-center justify-end mt-1 text-right font-medium">
            {message.users?.name} <Dot /> {dayjs(message.created_at).fromNow()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
