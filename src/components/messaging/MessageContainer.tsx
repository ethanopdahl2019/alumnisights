
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { getMessages, sendMessage } from '@/services/messages';
import { Message } from '@/types/messages';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MessageContainerProps {
  recipientId: string;
  recipientName: string;
  recipientImage?: string | null;
}

const MessageContainer: React.FC<MessageContainerProps> = ({
  recipientId,
  recipientName,
  recipientImage,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const fetchedMessages = await getMessages(recipientId);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [recipientId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    if (newMessage.length > 120) {
      toast.error('Message cannot exceed 120 characters');
      return;
    }
    
    setLoading(true);
    try {
      const sentMessage = await sendMessage(recipientId, newMessage);
      setMessages([...messages, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg p-4">
        <p className="text-gray-500">Please sign in to send messages</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <div className="flex items-center">
          <img 
            src={recipientImage || "/placeholder.svg"} 
            alt={recipientName} 
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
          <div>
            <h3 className="font-medium">{recipientName}</h3>
            <p className="text-xs text-gray-500">120 character limit per message</p>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center">
            <div className="animate-pulse bg-gray-200 h-10 w-3/4 rounded-md"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2",
                message.sender_id === user.id
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-100 mr-auto"
              )}
            >
              <p>{message.content}</p>
              <span className={cn(
                "text-xs block mt-1",
                message.sender_id === user.id
                  ? "text-blue-100 text-right"
                  : "text-gray-500"
              )}>
                {new Date(message.created_at).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="resize-none"
            maxLength={120}
          />
          <Button 
            type="submit" 
            disabled={loading || !newMessage.trim() || newMessage.length > 120}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between mt-2">
          <span className={cn(
            "text-xs",
            newMessage.length > 120 ? "text-red-500" : "text-gray-500"
          )}>
            {newMessage.length}/120 characters
          </span>
        </div>
      </form>
    </div>
  );
};

export default MessageContainer;
