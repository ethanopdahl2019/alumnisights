
import { supabase } from "@/integrations/supabase/client";

// Types
export interface Conversation {
  id: string;
  student_id: string;
  mentor_id: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  profile?: {
    name: string;
    image: string | null;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_preset: boolean;
  created_at: string;
  read_at: string | null;
}

export interface PresetMessage {
  id: string;
  content: string;
  category: string | null;
  created_at: string;
}

// Get all conversations for the current user
export const getConversations = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("conversations")
    .select(`
      *,
      profile:profiles(name, image)
    `)
    .or(`student_id.eq.${user.id},mentor_id.eq.${user.id}`)
    .order('last_message_at', { ascending: false });

  if (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }

  return data as Array<Conversation & { profile: { name: string; image: string | null } }>;
};

// Get a specific conversation
export const getConversation = async (conversationId: string) => {
  const { data, error } = await supabase
    .from("conversations")
    .select(`
      *,
      mentor:profiles!conversations_mentor_id_fkey(id, name, image),
      student:profiles!conversations_student_id_fkey(id, name, image)
    `)
    .eq('id', conversationId)
    .single();

  if (error) {
    console.error("Error fetching conversation:", error);
    throw error;
  }

  return data;
};

// Get messages for a conversation
export const getMessages = async (conversationId: string) => {
  const { data, error } = await supabase
    .from("conversation_messages")
    .select("*")
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }

  return data as Message[];
};

// Send a message
export const sendMessage = async (conversationId: string, content: string, isPreset = false) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Not authenticated");

  // Check if user is a mentor to apply character limit
  const { data: conversation } = await supabase
    .from("conversations")
    .select("mentor_id")
    .eq('id', conversationId)
    .single();

  if (conversation && conversation.mentor_id === user.id) {
    // Apply character limit for mentors (120 chars)
    if (content.length > 120) {
      content = content.substring(0, 120);
    }
  }

  const { data, error } = await supabase
    .from("conversation_messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
      is_preset: isPreset
    })
    .select()
    .single();

  if (error) {
    console.error("Error sending message:", error);
    throw error;
  }

  return data as Message;
};

// Start a new conversation with a mentor
export const startConversation = async (mentorId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      student_id: user.id,
      mentor_id: mentorId
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }

  return data as Conversation;
};

// Get preset messages
export const getPresetMessages = async () => {
  const { data, error } = await supabase
    .from("preset_messages")
    .select("*")
    .order('category', { ascending: true });

  if (error) {
    console.error("Error fetching preset messages:", error);
    throw error;
  }

  return data as PresetMessage[];
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("conversation_messages")
    .update({ read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .neq('sender_id', user.id)
    .is('read_at', null);

  if (error) {
    console.error("Error marking messages as read:", error);
    throw error;
  }

  return true;
};
