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

export interface Message {
  id: number;
  content: string;
  channel_id: string;
  created_by: string;
  created_at: string;
  users: User;
}
