import {
  createMessage,
  deleteMessage,
  getMessagesByChannelId,
} from "@/apis/messages";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetMessages = (channelId: string) => {
  return useQuery({
    queryKey: ["messages"],
    queryFn: () => getMessagesByChannelId(channelId),
    enabled: !!channelId
  });
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      channelId,
      content,
    }: {
      channelId: string;
      content: string;
    }) => createMessage({ channelId, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (messageId: string) => deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};
