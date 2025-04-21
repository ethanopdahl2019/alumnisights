
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Messages = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchConversation = async () => {
      if (!conversationId) return;

      try {
        const { data, error } = await supabase
          .from("conversations")
          .select(`
            *,
            alumni:alumni_id(id, name, user_id, image),
            applicant:applicant_id(id, name, user_id, image)
          `)
          .eq("id", conversationId)
          .single();

        if (error) throw error;
        
        if (!data) {
          toast({
            title: "Not Found",
            description: "This conversation doesn't exist",
            variant: "destructive",
          });
          navigate(-1);
          return;
        }

        // Check if user is part of this conversation
        if (data.alumni_id !== user.id && data.applicant_id !== user.id) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to view this conversation",
            variant: "destructive",
          });
          navigate(-1);
          return;
        }

        setConversation(data);

        // Determine the other user in the conversation
        if (data.alumni.user_id === user.id) {
          setOtherUser(data.applicant);
        } else {
          setOtherUser(data.alumni);
        }

        // Fetch messages
        await fetchMessages();
      } catch (error) {
        console.error("Error fetching conversation:", error);
        toast({
          title: "Error",
          description: "Failed to load conversation",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [conversationId, user, navigate, toast]);

  const fetchMessages = async () => {
    if (!conversationId) return;

    try {
      // Create a query to get all messages where either the sender or recipient is the other person
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user?.id},recipient_id.eq.${user?.id}`)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Filter messages to only those between the two users in this conversation
      const relevantMessages = data?.filter(msg => 
        (msg.sender_id === user?.id || msg.recipient_id === user?.id) &&
        (msg.sender_id === otherUser?.user_id || msg.recipient_id === otherUser?.user_id)
      ) || [];

      setMessages(relevantMessages);
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !otherUser) return;
    
    setSending(true);
    
    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          content: newMessage.trim(),
          sender_id: user.id,
          recipient_id: otherUser.user_id
        });
      
      if (error) throw error;
      
      setNewMessage("");
      await fetchMessages();
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  // Handle enter key to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container-custom py-10 text-center">
          <p>Loading conversation...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="container-custom py-10">
        <div className="max-w-3xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {otherUser && (
                    <>
                      <Avatar>
                        <AvatarImage src={otherUser.image} />
                        <AvatarFallback>
                          {otherUser.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{otherUser.name}</span>
                    </>
                  )}
                </CardTitle>
                <div className="text-sm">
                  {conversation && (
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {conversation.product_type}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        conversation.payment_status === "paid" 
                          ? "bg-green-50 text-green-700" 
                          : "bg-yellow-50 text-yellow-800"
                      }`}>
                        {conversation.payment_status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
          
          {/* Messages */}
          <div className="bg-white border rounded-lg p-4 mb-4 h-[400px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                No messages yet. Start the conversation!
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwnMessage = message.sender_id === user?.id;
                  
                  return (
                    <div 
                      key={message.id} 
                      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div 
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          isOwnMessage 
                            ? "bg-blue-500 text-white" 
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <div 
                          className={`text-xs mt-1 ${
                            isOwnMessage ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Message Input */}
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="resize-none"
              rows={3}
            />
            <Button 
              onClick={sendMessage} 
              disabled={sending || !newMessage.trim()}
              className="h-auto"
            >
              Send
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Messages;
