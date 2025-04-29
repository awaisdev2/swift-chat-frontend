import apiClient from "./apiClient";

export const getRooms = async () => {
  const res = await apiClient.get("/rooms");
  return res.data;
};

export const createRoom = async (data: {
  name: string;
  is_public: boolean;
}) => {
  const res = await apiClient.post("/rooms", data);
  return res.data;
};
