
export interface AdminRequest {
  id: string;
  user_id: string;
  request_type: string;
  reason: string;
  status: string;
  created_at: string;
  user_email?: string;
  user_name?: string;
}
