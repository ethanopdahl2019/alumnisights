
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, MessageSquare } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageList } from "@/components/messaging/MessageList";
import { MessageInput } from "@/components/messaging/MessageInput";
import { PresetMessageSelector } from "@/components/messaging/PresetMessageSelector";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useAuth } from "@/components/AuthProvider";
import { 
  getConversation, 
  getMessages, 
  sendMessage, 
  markMessagesAsRead 
} from "@/services/messaging";

const ConversationPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPresets, setShowPresets] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { state: { from: `/messaging/conversation/${id}` } });
    }
  }, [user, loading, navigate, id]);

  // Fetch conversation data
  const { data: conversation, isLoading: conversationLoading } = useQuery({
    queryKey: ["conversation", id],
    queryFn: () => id ? getConversation(id) : Promise.reject("No conversation ID"),
    enabled: !!id && !!user,
  });

  // Fetch messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => id ? getMessages(id) : Promise.reject("No conversation ID"),
    enabled: !!id && !!user,
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });

  // Mark messages as read
  const markAsReadMutation = useMutation({
    mutationFn: () => id ? markMessagesAsRead(id) : Promise.reject("No conversation ID"),
    onError: (error) => {
      console.error("Failed to mark messages as read:", error);
    },
  });

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => id ? sendMessage(id, content) : Promise.reject("No conversation ID"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", id] });
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    },
  });

  const handleSendMessage = async (content: string) => {
    await sendMessageMutation.mutateAsync(content);
  };

  const handleSendPresetMessage = async (content: string) => {
    await sendMessageMutation.mutateAsync(content);
    setShowPresets(false);
  };

  const handleScrollToBottom = () => {
    markAsReadMutation.mutate();
  };

  // Show loading state
  if (loading || conversationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Handle conversation not found
  if (!conversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow container-custom py-8">
          <div className="max-w-3xl mx-auto text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Conversation not found</h2>
            <Button asChild>
              <Link to="/messaging">Back to Messages</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Create default values to avoid null errors
  const defaultStudent = { id: "", name: "Student", image: null };
  const defaultMentor = { id: "", name: "Mentor", image: null };

  // Safely extract data with defaults and type checking
  const student = conversation.student || defaultStudent;
  const mentor = conversation.mentor || defaultMentor;
  
  // Determine if the current user is the mentor or student
  const isMentor = user?.id === mentor.id;
  const otherPerson = isMentor ? student : mentor;

  // Create profiles object for MessageList
  const profiles = {
    [mentor.id || "mentor"]: {
      name: mentor.name || "Mentor",
      image: mentor.image || null,
    },
    [student.id || "student"]: {
      name: student.name || "Student",
      image: student.image || null,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Conversation with {otherPerson?.name || "User"} | AlumniSights</title>
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow container-custom py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="border-b p-4">
              <div className="flex items-center">
                <Button variant="ghost" size="sm" className="mr-2" asChild>
                  <Link to="/messaging">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    {otherPerson?.image ? (
                      <AvatarImage src={otherPerson.image} alt={otherPerson.name || "User"} />
                    ) : (
                      <AvatarFallback>
                        {(otherPerson?.name || "User").substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-lg">{otherPerson?.name || "User"}</h2>
                    <p className="text-sm text-gray-500">
                      {isMentor ? "Student" : "Mentor"}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 flex flex-col h-[500px]">
              {messagesLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <MessageList 
                  messages={messages} 
                  profiles={profiles} 
                  onScrollToBottom={handleScrollToBottom}
                />
              )}
            </CardContent>
            
            <CardFooter className="p-0 flex flex-col">
              {!isMentor && (
                <div className="px-3 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowPresets(!showPresets)}
                  >
                    {showPresets ? "Hide Preset Messages" : "Show Preset Messages"}
                  </Button>
                </div>
              )}

              {showPresets && !isMentor && (
                <div className="p-3 pt-2">
                  <PresetMessageSelector onSelect={handleSendPresetMessage} />
                </div>
              )}

              <MessageInput
                onSend={handleSendMessage}
                isMentor={isMentor}
                showPresets={showPresets}
              />
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ConversationPage;
