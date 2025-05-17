
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { 
  getMentorChatsBetweenUsers, 
  sendMentorChat, 
  markMentorChatAsRead,
  subscribeToMentorChats
} from "@/services/mentor-chat";
import { MentorChatMessage } from "@/types/mentor-chat";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Send, ArrowLeft } from "lucide-react";

interface MentorChatConversationProps {
  recipientId: string;
}

export const MentorChatConversation = ({ recipientId }: MentorChatConversationProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<MentorChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [recipientProfile, setRecipientProfile] = useState<{ name: string; image?: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Fetch messages and subscribe to new ones
  useEffect(() => {
    if (!user || !recipientId) return;
    
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await getMentorChatsBetweenUsers(user.id, recipientId);
        setMessages(fetchedMessages);
        
        // Mark unread messages as read
        const unreadMessages = fetchedMessages.filter(
          msg => msg.recipient_id === user.id && !msg.read
        );
        
        for (const msg of unreadMessages) {
          await markMentorChatAsRead(msg.id);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Failed to load messages",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    const fetchRecipientProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, image')
          .eq('user_id', recipientId)
          .single();
          
        if (error) throw error;
        setRecipientProfile(data);
      } catch (error) {
        console.error('Error fetching recipient profile:', error);
      }
    };
    
    fetchMessages();
    fetchRecipientProfile();
    
    // Subscribe to new messages
    const unsubscribe = subscribeToMentorChats(user.id, async (newMessage) => {
      if (newMessage.sender_id === recipientId) {
        setMessages(prev => [...prev, newMessage]);
        await markMentorChatAsRead(newMessage.id);
      }
    });
    
    return () => unsubscribe();
  }, [user, recipientId, toast]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newMessage.trim() || sending) return;
    if (newMessage.length > 120) {
      toast({
        title: "Message too long",
        description: "Messages cannot exceed 120 characters",
        variant: "destructive"
      });
      return;
    }
    
    setSending(true);
    
    try {
      const sentMessage = await sendMentorChat(user.id, recipientId, newMessage.trim());
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };
  
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate('/mentor-chat')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        {recipientProfile ? (
          <div className="flex items-center">
            <img 
              src={recipientProfile.image || "/placeholder.svg"}
              alt={recipientProfile.name}
              className="w-10 h-10 rounded-full mr-3"
            />
            <span className="font-semibold">{recipientProfile.name}</span>
          </div>
        ) : (
          <div className="w-40 h-6 bg-gray-200 animate-pulse rounded"></div>
        )}
      </div>
      
      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`animate-pulse ${i % 2 === 0 ? 'ml-auto max-w-[80%]' : 'max-w-[80%]'}`}
              >
                <div className={`rounded-2xl p-3 ${i % 2 === 0 ? 'bg-gray-100' : 'bg-blue-100'}`}>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="h-3 mt-1 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <p>No messages yet</p>
            <p className="text-sm">Send a message to start the conversation</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex flex-col ${message.sender_id === user?.id ? 'items-end' : 'items-start'}`}
              >
                <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                  message.sender_id === user?.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100'
                }`}>
                  {message.content}
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      
      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t flex items-center gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Send a message (max 120 characters)"
          maxLength={120}
          className="flex-1"
          disabled={sending}
        />
        <div className="text-xs text-gray-500 mx-2">
          {newMessage.length}/120
        </div>
        <Button type="submit" size="icon" disabled={sending || newMessage.trim().length === 0}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
