
import { supabase } from '@/integrations/supabase/client';
import type { Message, Conversation } from '@/types/messages';

export async function getConversations(): Promise<Conversation[]> {
  const { data: session } = await supabase.auth.getSession();
  const currentUserId = session?.session?.user.id;
  
  if (!currentUserId) {
    throw new Error('User not authenticated');
  }
  
  // Query the messages table for latest conversations
  const { data: messages, error } = await supabase
    .from('messages')
    .select(`
      id,
      sender_id,
      recipient_id,
      content,
      read,
      created_at,
      sender:profiles!sender_id(name, image),
      recipient:profiles!recipient_id(name, image)
    `)
    .or(`sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
  
  // Transform the messages into conversations format
  const conversations: Conversation[] = messages?.map(msg => ({
    id: msg.id,
    sender_id: msg.sender_id,
    recipient_id: msg.recipient_id,
    content: msg.content,
    status: msg.read ? 'read' : 'sent',
    created_at: msg.created_at,
    sender_name: msg.sender?.name || 'Unknown',
    recipient_name: msg.recipient?.name || 'Unknown',
    sender_image: msg.sender?.image,
    recipient_image: msg.recipient?.image
  })) || [];
  
  return conversations;
}

export async function getMessages(otherUserId: string): Promise<Message[]> {
  const { data: session } = await supabase.auth.getSession();
  const currentUserId = session?.session?.user.id;
  
  if (!currentUserId) {
    throw new Error('User not authenticated');
  }
  
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${currentUserId})`)
    .order('created_at');
  
  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
  
  // Mark received messages as read
  const receivedMessages = messages?.filter(
    msg => msg.recipient_id === currentUserId && !msg.read
  ) || [];
  
  if (receivedMessages.length > 0) {
    await Promise.all(
      receivedMessages.map(msg =>
        supabase
          .from('messages')
          .update({ read: true })
          .eq('id', msg.id)
      )
    );
  }
  
  // Transform to Message type
  const transformedMessages: Message[] = messages?.map(msg => ({
    id: msg.id,
    sender_id: msg.sender_id,
    recipient_id: msg.recipient_id,
    content: msg.content,
    status: msg.read ? 'read' : 'sent',
    created_at: msg.created_at
  })) || [];
  
  return transformedMessages;
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
    .from('messages')
    .insert({
      sender_id: currentUserId,
      recipient_id: recipientId,
      content,
      read: false
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }
  
  // Transform to Message type
  const message: Message = {
    id: data.id,
    sender_id: data.sender_id,
    recipient_id: data.recipient_id,
    content: data.content,
    status: 'sent',
    created_at: data.created_at
  };
  
  return message;
}
