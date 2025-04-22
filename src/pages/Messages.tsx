
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

const Messages = () => {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchData = async () => {
      try {
        // Get user's profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        setUserProfile(profileData);

        // Get conversation
        const { data: conversationData } = await supabase
          .from("conversations")
          .select(`
            *,
            alumni:alumni_id(id, name, image, user_id),
            applicant:applicant_id(id, name, image, user_id)
          `)
          .eq("id", conversationId)
          .single();

        if (!conversationData) {
          toast({
            title: "Error",
            description: "Conversation not found",
            variant: "destructive"
          });
          navigate("/");
          return;
        }

        setConversation(conversationData);

        // Determine the other user in the conversation
        const alumni = conversationData.alumni;
        const applicant = conversationData.applicant;

        if (!alumni || !applicant) {
          throw new Error("Conversation participants not found");
        }

        // Check if current user is the alumni or the applicant
        if (profileData.id === alumni.id) {
          setOtherUser(applicant);
        } else if (profileData.id === applicant.id) {
          setOtherUser(alumni);
        } else {
          toast({
            title: "Access denied",
            description: "You are not a participant in this conversation",
            variant: "destructive"
          });
          navigate("/");
          return;
        }

        // Get messages
        const { data: messagesData } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });

        setMessages(messagesData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load conversation",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`conversation-${conversationId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, conversationId, navigate, toast]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

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
                      message.sender_id === userProfile.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender_id === userProfile.id
                          ? "bg-navy text-white"
                          : "bg-white border"
                      }`}
                    >
                      {message.content}
                      <div
                        className={`text-xs mt-1 ${
                          message.sender_id === userProfile.id
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
