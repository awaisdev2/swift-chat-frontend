import apiClient from "./apiClient";

export const getMessagesByChannelId = async (channelId: string) => {
  const res = await apiClient.get(`/messages/${channelId}`);
  return res.data;
};

export const createMessage = async ({
  channelId,
  content,
}: {
  channelId: string;
  content: string;
}) => {
  const res = await apiClient.post(`/messages/${channelId}`, {content});
  return res.data;
};

export const deleteMessage = async (messageId: string) => {
  const res = await apiClient.delete(`/messages/${messageId}`);
  return res.data;
};
