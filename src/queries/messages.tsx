import {
  createMessage,
  deleteMessage,
  getMessagesByChannelId,
  updateMessage,
} from "@/apis/messages";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetMessages = (channelId: string) => {
  return useQuery({
    queryKey: ["messages", channelId],
    queryFn: () => getMessagesByChannelId(channelId),
    enabled: !!channelId,
  });
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      channelId,
      content,
      attachment,
    }: {
      channelId: string;
      content: string;
      attachment?: string;
    }) => createMessage({ channelId, content, attachment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};

export const useUpdateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      messageId,
      content,
      attachment,
    }: {
      messageId: string;
      content: string;
      attachment?: string;
    }) => updateMessage({ messageId, content, attachment }),
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
