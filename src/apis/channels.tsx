import apiClient from "./apiClient";

export const getChannels = async () => {
  const res = await apiClient.get("/channels");
  return res.data;
};

export const getChannelById = async (channelId: string) => {
  const res = await apiClient.get(`/channels/${channelId}`);
  return res.data;
};

export const createChannel = async (data: {name: string}) => {
  const res = await apiClient.post("/channels", data);
  return res.data;
};
