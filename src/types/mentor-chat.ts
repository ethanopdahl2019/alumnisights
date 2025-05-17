
export interface MentorChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export interface MentorChatContact {
  id: string;
  name: string;
  image?: string;
  unreadCount: number;
  lastMessage?: {
    content: string;
    created_at: string;
  };
}
