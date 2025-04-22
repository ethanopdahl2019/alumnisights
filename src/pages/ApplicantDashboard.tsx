
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const ApplicantDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
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

        // Fetch conversations
        const { data: conversationsData, error: conversationsError } = await supabase
          .from("conversations")
          .select(`
            *,
            alumni:alumni_id(id, name, user_id, image, school_id, schools:school_id(name))
          `)
          .eq("applicant_id", profileData.id)
          .order("updated_at", { ascending: false });

        if (conversationsError) throw conversationsError;
        setConversations(conversationsData || []);
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
                  <button 
                    onClick={() => navigate("/browse")}
                    className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
                  >
                    Browse Alumni
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {conversations.map((conversation) => (
                    <div 
                      key={conversation.id} 
                      className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/messages/${conversation.id}`)}
                    >
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={conversation.alumni?.image} alt={conversation.alumni?.name || "Alumni"} />
                          <AvatarFallback>{conversation.alumni?.name?.charAt(0) || "A"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{conversation.alumni?.name || "Unnamed Alumni"}</h3>
                          <p className="text-sm text-gray-500">
                            {conversation.alumni?.schools?.name || "Unknown School"} · {conversation.product_type}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          conversation.payment_status === "paid" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {conversation.payment_status}
                        </span>
                      </div>
                    </div>
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
              <button 
                onClick={() => navigate("/browse")}
                className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
              >
                Browse All Alumni
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ApplicantDashboard;
