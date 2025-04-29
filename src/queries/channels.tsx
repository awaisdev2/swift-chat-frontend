import { getChannels, createChannel } from "@/apis/channels";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetChannels = () => {
  return useQuery({ queryKey: ["channels"], queryFn: () => getChannels() });
};

export const useCreateChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {name: string, roomId: string}) => createChannel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });
};
