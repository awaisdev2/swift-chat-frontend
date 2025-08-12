/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { Smile, Paperclip } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Button } from "@/components/ui/button";

import { useCreateMessage, useUpdateMessage } from "@/queries/messages";
import { getSocket } from "@/utils/socket";
import { useUser } from "@clerk/clerk-react";
import AttachmentUploader, {
  AttachmentUploaderHandle,
} from "@/utils/AttachmentUploader";
import { Message } from "@/utils/messages.type";

type EomjiMartProps = {
  id: string;
  shortcodes: string;
  native: string;
  name: string;
  unified: string;
  keywords: string[];
};

const MessageInput = ({
  channelId,
  message,
  setIsEditing,
}: {
  channelId: string;
  message?: Message;
  setIsEditing?: (value: boolean) => void;
}) => {
  const { user } = useUser();
  const [text, setText] = useState(message?.content || "");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(
    message?.attachments?.[0]?.url || null
  );
  const [attachments, setAttachments] = useState<any>(
    message?.attachments?.[0] || null
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    message?.attachments?.[0]?.url || null
  );
  const { mutateAsync: createMessage, isPending: isCreating } =
    useCreateMessage();
  const { mutateAsync: updateMessage, isPending: isUpdating } =
    useUpdateMessage();

  const uploaderRef = useRef<AttachmentUploaderHandle>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addEmoji = (emoji: EomjiMartProps) => {
    setText((prev) => prev + emoji.native);
  };

  const handleFileUpload = (url: string) => {
    setAttachmentUrl(url);
    setPreviewUrl(url);
  };

  const handleFileRemove = () => {
    setAttachmentUrl(null);
    setPreviewUrl(null);
  };

  const sendMessage = async () => {
    if (!text.trim() && !attachmentUrl) return;

    const socket = getSocket();
    if (!socket) return;

    if (message) {
      await updateMessage({
        channelId,
        messageId: message.id.toString(),
        content: text,
        attachments: attachmentUrl
          ? [
              {
                original_name: attachments?.name,
                file_type: attachments?.type,
                url: attachmentUrl,
              },
            ]
          : undefined,
      });
      if (setIsEditing) setIsEditing(false);
    } else {
      await createMessage({
        channelId,
        content: text,
        attachments: attachmentUrl
          ? [
              {
                original_name: attachments?.name,
                file_type: attachments?.type,
                url: attachmentUrl,
              },
            ]
          : undefined,
      });
    }

    socket.emit("send-message", {
      text,
      sender: {
        content: text,
        channelId,
        senderId: user?.id,
        name: user?.fullName,
        image: user?.imageUrl,
        email: user?.emailAddresses,
        attachments: attachmentUrl
          ? [
              {
                original_name: attachments?.name,
                file_type: attachments?.type,
                url: attachmentUrl,
              },
            ]
          : undefined,
      },
      self: true,
      channelId,
      attachments: attachmentUrl
        ? [
            {
              original_name: attachments?.name,
              file_type: attachments?.type,
              url: attachmentUrl,
            },
          ]
        : undefined,
    });

    setText("");
    setAttachmentUrl(null);
    uploaderRef.current?.clearFile();
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [text]);

  return (
    <div className={`flex flex-col p-4 ${message ? "border-0" : "border-t"}`}>
      {showEmojiPicker && (
        <div className="mb-2 absolute bottom-20 right-20">
          <Picker data={data} theme="light" onEmojiSelect={addEmoji} />
        </div>
      )}

      <div className={`${setIsEditing ? "block" : "flex"} items-center gap-2`}>
        <div className={`${setIsEditing ? "w-full mb-3" : "w-full"}`}>
          <div className="relative bg-gray-50 border block w-full px-4 border-gray-300 text-gray-900 text-sm rounded-lg">
            <textarea
              ref={textareaRef}
              value={text}
              rows={1}
              className="resize-none w-[90%] max-h-[200px] outline-none border-0 ring-0 p-2 bg-transparent overflow-y-auto"
              placeholder="Enter your message here"
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <div
              className={`absolute ${
                setIsEditing ? "top-[6px] right-0" : "inset-y-0 end-0"
              } flex items-center gap-1 px-3.5`}
            >
              <Button
                type="button"
                size="sm"
                className="px-2"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              >
                <Smile />
              </Button>
              <Button
                type="button"
                size="sm"
                className="px-2"
                onClick={() => uploaderRef.current?.triggerFileSelect()}
                disabled={!!previewUrl}
              >
                <Paperclip />
              </Button>
            </div>
          </div>
        </div>

        {message && setIsEditing && (
          <Button
            type="button"
            onClick={() => setIsEditing(false)}
            disabled={isUpdating}
            className="mr-2 bg-white text-black hover:bg-gray-300"
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          onClick={sendMessage}
          className={`${
            setIsEditing ? "bg-white text-black hover:bg-gray-300" : ""
          }`}
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating ? "Sending..." : "Send"}
        </Button>
      </div>

      <AttachmentUploader
        ref={uploaderRef}
        chatId={channelId}
        onUpload={handleFileUpload}
        onRemove={handleFileRemove}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
        setAttachments={setAttachments}
      />
    </div>
  );
};

export default MessageInput;
