
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Simplified types to avoid circular references
interface Profile {
  id: string;
  name: string;
  image: string | null;
  user_id: string;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface Conversation {
  id: string;
  alumni_id: string;
  applicant_id: string;
  product_type: string;
  payment_status: string;
  alumni: Profile | null;
  applicant: Profile | null;
}

const Messages = () => {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [otherUser, setOtherUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchData = async () => {
      try {
        // Get user's profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError) throw profileError;
        setUserProfile(profileData);

        // Get basic conversation data
        const { data: conversationBasic, error: conversationError } = await supabase
          .from("conversations")
          .select("*")
          .eq("id", conversationId)
          .single();

        if (conversationError) throw conversationError;
        if (!conversationBasic) {
          toast({
            title: "Error",
            description: "Conversation not found",
            variant: "destructive"
          });
          navigate("/");
          return;
        }

        // Check if payment is required but not made
        if (conversationBasic.payment_status !== "completed" && 
            conversationBasic.payment_status !== "free") {
          toast({
            title: "Access Restricted",
            description: "You need to purchase this service to message this alumni",
            variant: "destructive"
          });
          navigate("/browse");
          return;
        }

        // Get alumni profile
        const { data: alumniData, error: alumniError } = await supabase
          .from("profiles")
          .select("id, name, image, user_id")
          .eq("id", conversationBasic.alumni_id)
          .single();
          
        if (alumniError) throw alumniError;
        
        // Get applicant profile
        const { data: applicantData, error: applicantError } = await supabase
          .from("profiles")
          .select("id, name, image, user_id")
          .eq("id", conversationBasic.applicant_id)
          .single();
          
        if (applicantError) throw applicantError;

        // Build the conversation object
        const fullConversation = {
          ...conversationBasic,
          alumni: alumniData,
          applicant: applicantData
        };
        
        setConversation(fullConversation);

        // Determine which user is the other participant
        if (profileData.id === alumniData.id) {
          setOtherUser(applicantData);
        } else if (profileData.id === applicantData.id) {
          setOtherUser(alumniData);
        } else {
          throw new Error("You are not a participant in this conversation");
        }

        // Get messages
        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });

        if (messagesError) throw messagesError;
        setMessages(messagesData || []);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load conversation",
          variant: "destructive"
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscription
    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, conversationId, navigate, toast]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !otherUser || !userProfile) return;

    try {
      setSending(true);
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: userProfile.id,
        recipient_id: otherUser.id,
        content: newMessage,
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setSending(false);
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
      <div className="container-custom py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="mr-2"
            >
              ← Back
            </Button>
            <h1 className="text-2xl font-bold">
              Conversation with {otherUser?.name}
            </h1>
          </div>

          <Card className="mb-6 p-4">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={otherUser?.image} alt={otherUser?.name} />
                <AvatarFallback>{otherUser?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-medium">{otherUser?.name}</h2>
                <p className="text-sm text-gray-500">
                  {conversation?.product_type} - {conversation?.payment_status}
                </p>
              </div>
            </div>
          </Card>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 h-[50vh] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No messages yet. Start the conversation!
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_id === userProfile?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender_id === userProfile?.id
                          ? "bg-navy text-white"
                          : "bg-white border"
                      }`}
                    >
                      {message.content}
                      <div
                        className={`text-xs mt-1 ${
                          message.sender_id === userProfile?.id
                            ? "text-white/70"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={sending}
              className="flex-grow"
            />
            <Button type="submit" disabled={sending}>
              Send
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Messages;
