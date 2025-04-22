
export interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  read: boolean;
  attachment_url?: string | null;
}

export interface Conversation {
  id: string;
  applicant_id: string;
  alumni_id: string;
  product_type: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  applicant?: {
    id: string;
    name: string;
    image: string | null;
  };
  alumni?: {
    id: string;
    name: string;
    image: string | null;
    schools?: {
      name: string;
    };
  };
  last_message?: {
    content: string;
    created_at: string;
  };
}
