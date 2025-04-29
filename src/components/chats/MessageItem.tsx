/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUser } from "@clerk/clerk-react";

const MessageItem = ({ message }: { message: any }) => {
  const { user } = useUser();
  const isRecipientUser = user?.id === message.created_by;
  return (
    <div
      className={`flex ${
        isRecipientUser ? "justify-end" : "justify-start"
      } px-4 py-2`}
    >
      {message.content && (
        <div
          className={`flex items-center ${
            isRecipientUser ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <img
            src={message.users?.image || '/assets/blank.png'}
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
            <p className="text-sm">{message.content}</p>
            <span className="text-xs block mt-1 text-right font-medium">
              {message.users?.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
