import { createRoom, getRooms } from "@/apis/rooms";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetRooms = () => {
  return useQuery({ queryKey: ["rooms"], queryFn: () => getRooms() });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {name: string, is_public: boolean}) => createRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};
