
export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  status: 'sent' | 'delivered' | 'read';
  created_at: string;
}

export interface Conversation {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  status: 'sent' | 'delivered' | 'read';
  created_at: string;
  sender_name: string;
  recipient_name: string;
  sender_image: string | null;
  recipient_image: string | null;
}

export interface MessageFormData {
  content: string;
}
