
import { supabase } from "@/integrations/supabase/client";

// Types
export interface Conversation {
  id: string;
  student_id?: string;
  mentor_id?: string;
  created_at: string;
  updated_at: string;
  last_message_at?: string;
  // Legacy fields that might exist in the database
  applicant_id?: string; 
  alumni_id?: string;
  product_type?: string;
  payment_status?: string;
  profile?: {
    name: string;
    image: string | null;
  };
  student?: {
    id: string;
    name: string;
    image: string | null;
  } | null;
  mentor?: {
    id: string;
    name: string;
    image: string | null;
  } | null;
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

  try {
    // Try to fetch conversations from the database
    const { data, error } = await supabase
      .from("conversations")
      .select(`
        id, student_id, mentor_id, created_at, updated_at, last_message_at,
        student:profiles!conversations_student_id_fkey(id, name, image),
        mentor:profiles!conversations_mentor_id_fkey(id, name, image)
      `)
      .or(`student_id.eq.${user.id},mentor_id.eq.${user.id}`);

    if (error) {
      console.error("Error fetching conversations:", error);
      return [];
    }

    // Process the conversations data
    if (data && data.length > 0) {
      return data.map(conv => {
        // Type guard to ensure we have objects
        const studentData = typeof conv.student === 'object' && conv.student ? conv.student : null;
        const mentorData = typeof conv.mentor === 'object' && conv.mentor ? conv.mentor : null;

        // Determine if user is student or mentor
        const isStudent = user.id === conv.student_id;
        const profileData = isStudent ? mentorData : studentData;
        
        const profile = {
          name: profileData?.name || (isStudent ? "Mentor" : "Student"),
          image: profileData?.image || null
        };

        return {
          ...conv,
          profile
        };
      });
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

// Get a specific conversation
export const getConversation = async (conversationId: string) => {
  try {
    const { data, error } = await supabase
      .from("conversations")
      .select(`
        *,
        mentor:profiles!conversations_mentor_id_fkey(id, name, image),
        student:profiles!conversations_student_id_fkey(id, name, image)
      `)
      .eq('id', conversationId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching conversation:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Ensure we have valid student and mentor objects
    return {
      ...data,
      student: typeof data.student === 'object' ? data.student : { id: "", name: "Student", image: null },
      mentor: typeof data.mentor === 'object' ? data.mentor : { id: "", name: "Mentor", image: null }
    };
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return null;
  }
};

// Get messages for a conversation
export const getMessages = async (conversationId: string) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
    
    // Cast data to Message[] type
    return (data || []) as Message[];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

// Send a message
export const sendMessage = async (conversationId: string, content: string, isPreset = false) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Not authenticated");

  try {
    // Check if user is a mentor to apply character limit
    const { data: conversation } = await supabase
      .from("conversations")
      .select("mentor_id")
      .eq('id', conversationId)
      .single();

    // Apply character limit for mentors
    let finalContent = content;
    if (conversation && conversation.mentor_id === user.id) {
      if (content.length > 120) {
        finalContent = content.substring(0, 120);
      }
    }

    // Insert the message
    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: finalContent,
        is_preset: isPreset
      })
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      throw error;
    }

    return data as Message;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Start a new conversation with a mentor
export const startConversation = async (mentorId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Not authenticated");

  try {
    // Insert a new conversation
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
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};

// Get preset messages
export const getPresetMessages = async () => {
  try {
    const { data, error } = await supabase
      .from("preset_messages")
      .select("*")
      .order('category', { ascending: true });

    if (error) {
      console.error("Error fetching preset messages:", error);
      throw error;
    }

    return (data || []) as PresetMessage[];
  } catch (error) {
    console.error("Error fetching preset messages:", error);
    return [];
  }
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Not authenticated");

  try {
    // Update messages that are unread and not sent by current user
    const { error } = await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id)
      .is('read_at', null);

    if (error) {
      console.error("Error marking messages as read:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return false;
  }
};
