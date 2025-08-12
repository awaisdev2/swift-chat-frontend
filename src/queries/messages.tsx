import {
  createMessage,
  deleteMessage,
  getMessagesByChannelId,
  updateMessage,
} from "@/apis/messages";
import { MessageAttachments } from "@/utils/messages.type";
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
      attachments,
    }: {
      channelId: string;
      content: string;
      attachments?: MessageAttachments[];
    }) => createMessage({ channelId, content, attachments }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};

export const useUpdateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      channelId,
      messageId,
      content,
      attachments,
    }: {
      channelId: string;
      messageId: string;
      content: string;
      attachments?: MessageAttachments[];
    }) => updateMessage({ channelId, messageId, content, attachments }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      channelId,
      messageId,
    }: {
      channelId: string;
      messageId: string;
    }) => deleteMessage({ channelId, messageId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};
