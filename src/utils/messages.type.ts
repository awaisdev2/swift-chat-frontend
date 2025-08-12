export interface User {
  id: string;
  clerk_id: string;
  name: string;
  email: string;
  username: string;
  image: string;
  created_at: string;
}

export interface MessageItemProps {
  message: Message;
}

export interface MessageAttachments {
  original_name: string;
  file_type: string;
  url: string | null;
}

export interface Message {
  id: number;
  content: string;
  attachments?: MessageAttachments[];
  channel_id: string;
  created_by: string;
  created_at: string;
  deleted_at: string | null;
  users: User;
}
