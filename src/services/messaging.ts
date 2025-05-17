
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
    // First, try with new schema (student_id/mentor_id)
    const { data: newSchemaData, error: newSchemaError } = await supabase
      .from("conversations")
      .select(`
        *,
        mentor:profiles!conversations_mentor_id_fkey(*),
        student:profiles!conversations_student_id_fkey(*)
      `)
      .or(`student_id.eq.${user.id},mentor_id.eq.${user.id}`);

    // If new schema worked
    if (!newSchemaError && newSchemaData && newSchemaData.length > 0) {
      return newSchemaData.map(conv => {
        const isStudent = user.id === conv.student_id;
        const otherUserProfile = isStudent ? conv.mentor : conv.student;
        
        return {
          ...conv,
          profile: otherUserProfile ? {
            name: otherUserProfile.name || "User",
            image: otherUserProfile.image
          } : {
            name: isStudent ? "Mentor" : "Student",
            image: null
          }
        };
      });
    }

    // Fallback to legacy schema (applicant_id/alumni_id)
    const { data: legacyData, error: legacyError } = await supabase
      .from("conversations")
      .select(`
        *,
        alumni:profiles!conversations_alumni_id_fkey(*),
        applicant:profiles!conversations_applicant_id_fkey(*)
      `)
      .or(`applicant_id.eq.${user.id},alumni_id.eq.${user.id}`);

    if (legacyError) {
      console.error("Error fetching conversations:", legacyError);
      return [];
    }

    if (legacyData && legacyData.length > 0) {
      return legacyData.map(conv => {
        const isApplicant = user.id === conv.applicant_id;
        const otherUserProfile = isApplicant ? conv.alumni : conv.applicant;
        
        return {
          ...conv,
          profile: otherUserProfile ? {
            name: otherUserProfile.name || "User",
            image: otherUserProfile.image
          } : {
            name: isApplicant ? "Alumni" : "Applicant",
            image: null
          }
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
    // Try new schema first
    const { data: newSchemaData, error: newSchemaError } = await supabase
      .from("conversations")
      .select(`
        *,
        mentor:profiles!conversations_mentor_id_fkey(*),
        student:profiles!conversations_student_id_fkey(*)
      `)
      .eq('id', conversationId)
      .maybeSingle();

    if (!newSchemaError && newSchemaData) {
      return {
        ...newSchemaData,
        student: newSchemaData.student || { id: "", name: "Student", image: null },
        mentor: newSchemaData.mentor || { id: "", name: "Mentor", image: null }
      };
    }

    // Try legacy schema as fallback
    const { data: legacyData, error: legacyError } = await supabase
      .from("conversations")
      .select(`
        *,
        alumni:profiles!conversations_alumni_id_fkey(*),
        applicant:profiles!conversations_applicant_id_fkey(*)
      `)
      .eq('id', conversationId)
      .maybeSingle();

    if (legacyError) {
      console.error("Error fetching conversation:", legacyError);
      return null;
    }

    if (!legacyData) {
      return null;
    }

    // Map legacy schema to expected format
    return {
      ...legacyData,
      student: legacyData.applicant || { id: "", name: "Student", image: null },
      mentor: legacyData.alumni || { id: "", name: "Mentor", image: null }
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
    
    return data as Message[];
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
    // Insert the message
    const { data, error } = await supabase
      .from("messages")
      .insert([{
        conversation_id: conversationId,
        sender_id: user.id,
        content: content,
        is_preset: isPreset
      }])
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      throw error;
    }

    // Update the conversation's last_message_at field
    await supabase
      .from("conversations")
      .update({ 
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', conversationId);

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
    // First check if a conversation already exists
    const { data: existingConv } = await supabase
      .from("conversations")
      .select("id")
      .eq('student_id', user.id)
      .eq('mentor_id', mentorId)
      .maybeSingle();

    if (existingConv) {
      return existingConv as Conversation;
    }

    // Insert a new conversation
    const { data, error } = await supabase
      .from("conversations")
      .insert([{
        student_id: user.id,
        mentor_id: mentorId
      }])
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
      return [];
    }

    return data as PresetMessage[];
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
