
import { supabase } from "@/integrations/supabase/client";
import { MentorChatMessage, MentorChatContact } from "@/types/mentor-chat";
import { ProfileWithDetails } from "@/types/database";

// Fetch all chats for the current user
export async function getMentorChats(userId: string): Promise<MentorChatMessage[]> {
  const { data, error } = await supabase
    .from('mentor_chats')
    .select('*')
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching mentor chats:', error);
    throw error;
  }
  
  return data as MentorChatMessage[];
}

// Fetch chats between two specific users
export async function getMentorChatsBetweenUsers(
  userId: string,
  otherUserId: string
): Promise<MentorChatMessage[]> {
  const { data, error } = await supabase
    .from('mentor_chats')
    .select('*')
    .or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`)
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error('Error fetching mentor chats between users:', error);
    throw error;
  }
  
  return data as MentorChatMessage[];
}

// Send a new message
export async function sendMentorChat(
  senderId: string, 
  recipientId: string, 
  content: string
): Promise<MentorChatMessage> {
  if (content.length > 120) {
    throw new Error("Message content cannot exceed 120 characters");
  }
  
  const { data, error } = await supabase
    .from('mentor_chats')
    .insert({
      sender_id: senderId,
      recipient_id: recipientId,
      content,
      read: false
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error sending mentor chat:', error);
    throw error;
  }
  
  return data as MentorChatMessage;
}

// Mark a message as read
export async function markMentorChatAsRead(messageId: string): Promise<void> {
  const { error } = await supabase
    .from('mentor_chats')
    .update({ read: true })
    .eq('id', messageId);
    
  if (error) {
    console.error('Error marking mentor chat as read:', error);
    throw error;
  }
}

// Get all unique contacts the user has chatted with
export async function getMentorChatContacts(userId: string): Promise<MentorChatContact[]> {
  // Get all messages involving the user
  const { data: messages, error } = await supabase
    .from('mentor_chats')
    .select('*')
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching mentor chat contacts:', error);
    throw error;
  }
  
  // Extract unique user IDs (excluding the current user)
  const contactIds = new Set<string>();
  messages.forEach(msg => {
    if (msg.sender_id === userId) {
      contactIds.add(msg.recipient_id);
    } else {
      contactIds.add(msg.sender_id);
    }
  });
  
  // Get profile information for each contact
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, name, image')
    .in('user_id', Array.from(contactIds));
    
  if (profilesError) {
    console.error('Error fetching contact profiles:', profilesError);
    throw profilesError;
  }
  
  // Build contact list with unread counts and last messages
  const contacts: MentorChatContact[] = [];
  const contactMap = new Map<string, ProfileWithDetails>();
  
  profiles.forEach(profile => {
    contactMap.set(profile.user_id, profile);
  });
  
  Array.from(contactIds).forEach(contactId => {
    const profile = contactMap.get(contactId);
    if (profile) {
      // Find the last message between these users
      const contactMessages = messages.filter(msg => 
        (msg.sender_id === contactId && msg.recipient_id === userId) || 
        (msg.sender_id === userId && msg.recipient_id === contactId)
      );
      
      // Count unread messages
      const unreadCount = contactMessages.filter(msg => 
        msg.sender_id === contactId && msg.recipient_id === userId && !msg.read
      ).length;
      
      // Get the last message
      const lastMessage = contactMessages[0];
      
      contacts.push({
        id: contactId,
        name: profile.name,
        image: profile.image,
        unreadCount,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          created_at: lastMessage.created_at
        } : undefined
      });
    }
  });
  
  return contacts;
}

// Subscribe to new messages
export function subscribeToMentorChats(
  userId: string, 
  callback: (message: MentorChatMessage) => void
): () => void {
  const channel = supabase
    .channel('mentor-chats')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'mentor_chats',
        filter: `recipient_id=eq.${userId}`
      },
      (payload) => {
        callback(payload.new as MentorChatMessage);
      }
    )
    .subscribe();
    
  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
}
