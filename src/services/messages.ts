
import { supabase } from '@/integrations/supabase/client';
import type { Message, Conversation } from '@/types/messages';

export async function getConversations(): Promise<Conversation[]> {
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
  
  return conversations || [];
}

export async function getMessages(otherUserId: string): Promise<Message[]> {
  const { data: session } = await supabase.auth.getSession();
  const currentUserId = session?.session?.user.id;
  
  if (!currentUserId) {
    throw new Error('User not authenticated');
  }
  
  const { data: messages, error } = await supabase
    .from('user_messages')
    .select('*')
    .or(`sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
    .and(`sender_id.eq.${otherUserId},recipient_id.eq.${otherUserId}`)
    .order('created_at');
  
  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
  
  // Mark received messages as read
  const receivedMessages = messages?.filter(
    msg => msg.recipient_id === currentUserId && msg.status !== 'read'
  ) || [];
  
  if (receivedMessages.length > 0) {
    await Promise.all(
      receivedMessages.map(msg =>
        supabase
          .from('user_messages')
          .update({ status: 'read' })
          .eq('id', msg.id)
      )
    );
  }
  
  return messages || [];
}

export async function sendMessage(recipientId: string, content: string): Promise<Message> {
  const { data: session } = await supabase.auth.getSession();
  const currentUserId = session?.session?.user.id;
  
  if (!currentUserId) {
    throw new Error('User not authenticated');
  }
  
  // Validate content length
  if (content.length > 120) {
    throw new Error('Message cannot exceed 120 characters');
  }
  
  const { data, error } = await supabase
    .from('user_messages')
    .insert({
      sender_id: currentUserId,
      recipient_id: recipientId,
      content,
      status: 'sent'
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }
  
  return data;
}
