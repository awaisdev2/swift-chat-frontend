import {
  getChannels,
  createChannel,
  getChannelById,
  updateChannel,
  deleteChannel,
} from "@/apis/channels";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetChannels = () => {
  return useQuery({ queryKey: ["channels"], queryFn: () => getChannels() });
};

export const useGetChannelById = (channelId: string) => {
  return useQuery({
    queryKey: ["channel_by_id", channelId],
    queryFn: () => getChannelById(channelId),
  });
};

export const useCreateChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string }) => createChannel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });
};

export const useUpdateChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ channelId, name }: { name: string; channelId: string }) =>
      updateChannel(channelId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });
};

export const useDeleteChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ channelId }: { channelId: string }) =>
      deleteChannel(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });
};
