
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
    // Check for the actual schema structure before making queries
    const { error: schemaCheckError } = await supabase
      .from("conversations")
      .select("student_id")
      .limit(1);
    
    const hasNewSchema = !schemaCheckError;
    
    if (hasNewSchema) {
      // Use new schema (student_id/mentor_id)
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          student:profiles(id, name, image),
          mentor:profiles(id, name, image)
        `)
        .or(`student_id.eq.${user.id},mentor_id.eq.${user.id}`);
      
      if (error) {
        console.error("Error fetching conversations:", error);
        return [];
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      return data.map(conv => {
        const isStudent = user.id === conv.student_id;
        const otherUser = isStudent ? conv.mentor : conv.student;
        
        return {
          ...conv,
          profile: otherUser ? {
            name: otherUser.name || "User",
            image: otherUser.image
          } : {
            name: isStudent ? "Mentor" : "Student",
            image: null
          }
        };
      });
    } else {
      // Fallback to legacy schema (applicant_id/alumni_id)
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          applicant:profiles(id, name, image),
          alumni:profiles(id, name, image)
        `)
        .or(`applicant_id.eq.${user.id},alumni_id.eq.${user.id}`);
      
      if (error) {
        console.error("Error fetching conversations:", error);
        return [];
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      return data.map(conv => {
        const isApplicant = user.id === conv.applicant_id;
        const otherUser = isApplicant ? conv.alumni : conv.applicant;
        
        return {
          ...conv,
          // Map the legacy schema to new schema for frontend consistency
          student: conv.applicant,
          mentor: conv.alumni,
          profile: otherUser ? {
            name: otherUser.name || "User",
            image: otherUser.image
          } : {
            name: isApplicant ? "Alumni" : "Applicant",
            image: null
          }
        };
      });
    }
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

// Get a specific conversation
export const getConversation = async (conversationId: string) => {
  try {
    // Check for the actual schema structure before making queries
    const { error: schemaCheckError } = await supabase
      .from("conversations")
      .select("student_id")
      .limit(1);
    
    const hasNewSchema = !schemaCheckError;
    
    if (hasNewSchema) {
      // Try new schema first
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          student:profiles(id, name, image),
          mentor:profiles(id, name, image)
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
      
      return {
        ...data,
        student: data.student || { id: "", name: "Student", image: null },
        mentor: data.mentor || { id: "", name: "Mentor", image: null }
      };
    } else {
      // Try legacy schema as fallback
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          applicant:profiles(id, name, image),
          alumni:profiles(id, name, image)
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
      
      // Map legacy schema to new schema for frontend consistency
      return {
        ...data,
        student: data.applicant || { id: "", name: "Student", image: null },
        mentor: data.alumni || { id: "", name: "Mentor", image: null }
      };
    }
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
    
    // Ensure the returned data matches our Message interface
    return data.map(msg => ({
      id: msg.id,
      conversation_id: msg.conversation_id || conversationId, // Default to passed conversationId if missing
      sender_id: msg.sender_id,
      content: msg.content,
      is_preset: msg.is_preset || false, // Default to false if missing
      created_at: msg.created_at,
      read_at: msg.read_at || null
    })) as Message[];
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
    // Check if the messages table has conversation_id
    const { data: columnsData, error: columnsError } = await supabase
      .rpc('get_column_information', { tablename: 'messages' });
    
    const columns = columnsData || [];
    const hasConversationId = columns.some(col => col.column_name === 'conversation_id');
    const hasRecipientId = columns.some(col => col.column_name === 'recipient_id');
    
    // Insert the message based on available columns
    let data, error;
    
    if (hasConversationId) {
      // New schema
      ({ data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
          is_preset: isPreset
        })
        .select()
        .single());
    } else if (hasRecipientId) {
      // Legacy schema - need to determine recipient
      const { data: convData } = await supabase
        .from("conversations")
        .select("*")
        .eq('id', conversationId)
        .single();
        
      if (!convData) {
        throw new Error("Conversation not found");
      }
      
      const recipientId = convData.applicant_id === user.id ? convData.alumni_id : convData.applicant_id;
      
      ({ data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          content,
          read: false
        })
        .select()
        .single());
    } else {
      throw new Error("Message schema not recognized");
    }

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

    // Convert to our Message interface format
    return {
      id: data.id,
      conversation_id: data.conversation_id || conversationId,
      sender_id: data.sender_id,
      content: data.content,
      is_preset: data.is_preset || isPreset,
      created_at: data.created_at,
      read_at: data.read_at || data.read === false ? null : new Date().toISOString()
    } as Message;
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
    // Check for the actual schema structure before making queries
    const { error: schemaCheckError } = await supabase
      .from("conversations")
      .select("student_id")
      .limit(1);
    
    const hasNewSchema = !schemaCheckError;
    
    // First check if a conversation already exists
    let existingConv;
    if (hasNewSchema) {
      const { data } = await supabase
        .from("conversations")
        .select("id")
        .eq('student_id', user.id)
        .eq('mentor_id', mentorId)
        .maybeSingle();
        
      existingConv = data;
    } else {
      const { data } = await supabase
        .from("conversations")
        .select("id")
        .eq('applicant_id', user.id)
        .eq('alumni_id', mentorId)
        .maybeSingle();
        
      existingConv = data;
    }

    if (existingConv) {
      return existingConv as Conversation;
    }

    // Insert a new conversation
    let data, error;
    
    if (hasNewSchema) {
      ({ data, error } = await supabase
        .from("conversations")
        .insert({
          student_id: user.id,
          mentor_id: mentorId
        })
        .select()
        .single());
    } else {
      ({ data, error } = await supabase
        .from("conversations")
        .insert({
          applicant_id: user.id,
          alumni_id: mentorId,
          product_type: 'chat', // Default value for legacy schema
          payment_status: 'paid' // Default value for legacy schema
        })
        .select()
        .single());
    }

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
    // Check if preset_messages table exists
    const { data: tableData, error: tableError } = await supabase
      .rpc('get_column_information', { tablename: 'preset_messages' });
      
    if (tableError || !tableData || tableData.length === 0) {
      console.error("Preset messages table not found:", tableError);
      return [];
    }
    
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
    // Check if the messages table has read_at
    const { data: columnsData, error: columnsError } = await supabase
      .rpc('get_column_information', { tablename: 'messages' });
    
    const columns = columnsData || [];
    const hasReadAt = columns.some(col => col.column_name === 'read_at');
    const hasRead = columns.some(col => col.column_name === 'read');
    const hasConversationId = columns.some(col => col.column_name === 'conversation_id');
    
    let error;
    
    if (hasConversationId && hasReadAt) {
      // New schema
      ({ error } = await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .is('read_at', null));
    } else if (hasRead) {
      // Legacy schema - need to determine related messages
      const { data: convData } = await supabase
        .from("conversations")
        .select("*")
        .eq('id', conversationId)
        .single();
        
      if (!convData) {
        throw new Error("Conversation not found");
      }
      
      const recipientId = convData.applicant_id === user.id ? convData.alumni_id : convData.applicant_id;
      
      ({ error } = await supabase
        .from("messages")
        .update({ read: true })
        .eq('sender_id', recipientId)
        .eq('recipient_id', user.id)
        .eq('read', false));
    } else {
      throw new Error("Message schema not recognized");
    }

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
