
import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ConversationList } from "@/components/messaging/ConversationList";
import { getConversations } from "@/services/messaging";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const MessagingPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    enabled: !!user,
  });

  React.useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { state: { from: "/messaging" } });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Messages | AlumniSights</title>
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow container-custom py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                Messages
              </h1>
            </div>
            
            <div className="p-4">
              <ConversationList />
              
              {!isLoading && !conversations?.length && (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    You haven't started any conversations yet.
                  </p>
                  <Button onClick={() => navigate("/browse")}>
                    Browse Mentors
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MessagingPage;
