import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, PaperclipIcon, SendIcon } from "lucide-react";
import { Message } from "@/types/database";

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
  const [isPaid, setIsPaid] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const predefinedMessages = [
    "I'm interested in booking a conversation",
    "Could you tell me more about your experience?",
    "What advice would you give to applicants?",
    "I'd like to learn more about your school"
  ];

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchData = async () => {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, name, image, user_id")
          .eq("user_id", user.id)
          .single();

        if (profileError) throw profileError;
        setUserProfile(profileData);

        const { data: conversationData, error: conversationError } = await supabase
          .from("conversations")
          .select("*")
          .eq("id", conversationId)
          .single();

        if (conversationError) throw conversationError;
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
        
        const isPaidOrFree = 
          conversationData.payment_status === "completed" || 
          conversationData.payment_status === "free";
        
        setIsPaid(isPaidOrFree);

        const isAlumni = profileData.id === conversationData.alumni_id;
        const otherUserId = isAlumni ? conversationData.applicant_id : conversationData.alumni_id;

        const { data: otherUserData, error: otherUserError } = await supabase
          .from("profiles")
          .select("id, name, image, user_id")
          .eq("id", otherUserId)
          .single();

        if (otherUserError) throw otherUserError;
        setOtherUser(otherUserData);

        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });

        if (messagesError) throw messagesError;
        
        const typedMessages: Message[] = messagesData?.map(msg => ({
          ...msg,
          attachment_url: msg.attachment_url || null
        })) || [];

        setMessages(typedMessages);
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

    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, conversationId, navigate, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${conversationId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('message-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('message-attachments')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload attachment",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!newMessage.trim() && !selectedFile) || !otherUser || !userProfile || !conversation) return;
    
    try {
      setSending(true);
      
      let attachmentUrl = null;
      if (selectedFile) {
        attachmentUrl = await uploadFile(selectedFile);
      }
      
      let messageContent = newMessage;
      if (!isPaid && userProfile.id === conversation.applicant_id) {
        if (!predefinedMessages.includes(messageContent)) {
          toast({
            title: "Message not sent",
            description: "Please select a predefined message or purchase a service from this alumni",
            variant: "destructive"
          });
          setSending(false);
          return;
        }
      }

      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: userProfile.id,
        recipient_id: otherUser.id,
        content: messageContent,
        attachment_url: attachmentUrl,
      });

      if (error) throw error;
      
      setNewMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
                  {conversation?.product_type} - {isPaid ? "Paid" : "Unpaid"}
                </p>
              </div>
            </div>
          </Card>

          {!isPaid && userProfile?.id === conversation?.applicant_id && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-amber-800">
                This is an unpaid conversation. You can only send predefined messages until you purchase a service.
              </p>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 mb-6 h-[50vh] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                <p>No messages yet. Start the conversation!</p>
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
                      
                      {message.attachment_url && (
                        <div className="mt-2">
                          <a 
                            href={message.attachment_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`flex items-center text-xs ${
                              message.sender_id === userProfile?.id
                                ? "text-white/90 hover:text-white"
                                : "text-blue-500 hover:text-blue-700"
                            }`}
                          >
                            <PaperclipIcon className="h-3 w-3 mr-1" />
                            Attachment
                          </a>
                        </div>
                      )}
                      
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
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {!isPaid && userProfile?.id === conversation?.applicant_id ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 mb-2">Select a message to send:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {predefinedMessages.map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => {
                      setNewMessage(message);
                      setTimeout(() => sendMessage(new Event('submit') as any), 100);
                    }}
                    className="justify-start text-left h-auto py-2"
                    disabled={sending}
                  >
                    {message}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={sendMessage} className="space-y-3">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={sending || uploading}
                className="w-full resize-none"
                rows={3}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={triggerFileInput}
                    disabled={sending || uploading}
                  >
                    <PaperclipIcon className="h-4 w-4 mr-2" />
                    {selectedFile ? selectedFile.name : "Attach File"}
                  </Button>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={sending || uploading || (!newMessage.trim() && !selectedFile)}
                  className="flex items-center"
                >
                  <SendIcon className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Messages;
