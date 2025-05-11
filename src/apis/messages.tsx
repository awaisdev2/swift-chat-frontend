import apiClient from "./apiClient";

export const getMessagesByChannelId = async (channelId: string) => {
  const res = await apiClient.get(`/messages/${channelId}`);
  return res.data;
};

export const createMessage = async ({
  channelId,
  content,
  attachment,
}: {
  channelId: string;
  content: string;
  attachment?: string;
}) => {
  const res = await apiClient.post(`/messages/${channelId}`, {content, attachment});
  return res.data;
};

export const updateMessage = async ({
  messageId,
  content,
  attachment,
}: {
  messageId: string;
  content: string;
  attachment?: string;
}) => {
  const res = await apiClient.put(`/messages/${messageId}`, {content, attachment});
  return res.data;
};

export const deleteMessage = async (messageId: string) => {
  const res = await apiClient.delete(`/messages/${messageId}`);
  return res.data;
};
