
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ConversationPreview from "@/components/ConversationPreview";

interface Conversation {
  id: string;
  alumni: {
    id: string;
    name: string;
    image: string | null;
    schools?: {
      name: string;
    };
  };
  product_type: string;
  payment_status: string;
  updated_at: string;
  last_message?: {
    content: string;
    created_at: string;
  };
}

const ApplicantDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchData = async () => {
      try {
        // Check if user is an applicant
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError) throw profileError;

        if (profileData.role !== "applicant") {
          toast({
            title: "Access denied",
            description: "This dashboard is only for applicant users",
            variant: "destructive"
          });
          navigate("/alumni-dashboard");
          return;
        }

        setProfile(profileData);

        // Fetch conversations with last message
        const { data: conversationsData, error: conversationsError } = await supabase
          .from("conversations")
          .select(`
            id,
            alumni_id,
            product_type,
            payment_status,
            updated_at,
            alumni:profiles!conversations_alumni_id_fkey(
              id, 
              name, 
              image,
              schools:schools(name)
            )
          `)
          .eq("applicant_id", profileData.id)
          .order("updated_at", { ascending: false });

        if (conversationsError) throw conversationsError;

        // Fetch the last message for each conversation
        const conversationsWithLastMessage = await Promise.all((conversationsData || []).map(async (conv) => {
          const { data: lastMessageData } = await supabase
            .from("messages")
            .select("content, created_at")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          return {
            ...conv,
            last_message: lastMessageData
          };
        }));

        setConversations(conversationsWithLastMessage || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, toast]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container-custom py-10 text-center">
          <p>Loading dashboard...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container-custom py-10">
        <h1 className="text-3xl font-bold mb-6">Applicant Dashboard</h1>

        <section className="mb-10">
          <Card>
            <CardHeader>
              <CardTitle>Your Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              {conversations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't spoken with any alumni yet</p>
                  <Button 
                    onClick={() => navigate("/browse")}
                    variant="default"
                  >
                    Browse Alumni
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {conversations.map((conversation) => (
                    <ConversationPreview
                      key={conversation.id}
                      id={conversation.id}
                      otherUser={{
                        name: conversation.alumni.name || "Unnamed Alumni",
                        image: conversation.alumni.image
                      }}
                      lastMessage={conversation.last_message?.content}
                      timestamp={conversation.last_message?.created_at || conversation.updated_at}
                      paymentStatus={conversation.payment_status}
                      productType={conversation.product_type}
                      schoolName={conversation.alumni.schools?.name}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Recommended Alumni</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* This would be populated with ProfileCard components based on user preferences */}
            <div className="text-center py-8 col-span-full">
              <p className="text-gray-500 mb-4">Explore alumni profiles to find your perfect match</p>
              <Button 
                onClick={() => navigate("/browse")}
                variant="default"
              >
                Browse All Alumni
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ApplicantDashboard;
