import apiClient from "./apiClient";

export const getChannels = async () => {
  const res = await apiClient.get("/channels");
  return res.data;
};

export const getChannelByRoomId = async (roomId: string) => {
  const res = await apiClient.get(`/channels/${roomId}`);
  return res.data;
};

export const createChannel = async (data: {name: string, roomId: string}) => {
  const res = await apiClient.post("/channels", data);
  return res.data;
};
