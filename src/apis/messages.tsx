import { MessageAttachments } from "@/utils/messages.type";
import apiClient from "./apiClient";

export const getMessagesByChannelId = async (channelId: string) => {
  const res = await apiClient.get(`/messages/${channelId}`);
  return res.data;
};

export const createMessage = async ({
  channelId,
  content,
  attachments,
}: {
  channelId: string;
  content: string;
  attachments?: MessageAttachments[];
}) => {
  const res = await apiClient.post(`/messages/${channelId}`, {
    content,
    attachments,
  });
  return res.data;
};

export const updateMessage = async ({
  channelId,
  messageId,
  content,
  attachments,
}: {
  channelId: string;
  messageId: string;
  content: string;
  attachments?: MessageAttachments[];
}) => {
  const res = await apiClient.put(
    `/messages/${channelId}/message/${messageId}`,
    {
      content,
      attachments,
    }
  );
  return res.data;
};

export const deleteMessage = async ({
  channelId,
  messageId,
}: {
  channelId: string;
  messageId: string;
}) => {
  const res = await apiClient.delete(
    `/messages/${channelId}/message/${messageId}`
  );
  return res.data;
};
