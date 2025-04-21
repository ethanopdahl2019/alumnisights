
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const ApplicantDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [convos, setConvos] = useState<any[]>([]);
  
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // Load profile data
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      
      if (data?.featured) {
        // An alumni account - redirect
        navigate("/alumni-dashboard");
        return;
      }
      
      setProfile(data);
    };
    
    // Load conversations
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*, alumni:alumni_id(name)")
        .eq("applicant_id", user.id);
        
      if (error) {
        console.error("Error fetching conversations:", error);
        return;
      }
      
      setConvos(data || []);
    };
    
    fetchProfile();
    fetchConversations();
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <main className="container-custom py-10">
        <h1 className="text-2xl font-bold mb-6">Applicant Dashboard</h1>
        
        {/* Alumni Conversations */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Your Alumni Conversations
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {convos.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p className="mb-3">No conversations yet. Browse profiles to find and connect with alumni.</p>
                <Button onClick={() => navigate("/browse")}>
                  Browse Alumni
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {convos.map((convo) => (
                  <div key={convo.id} className="flex items-center justify-between border rounded-lg p-4 bg-white shadow-sm">
                    <div>
                      <div className="font-medium text-navy">{convo.alumni?.name || convo.alumni_id}</div>
                      <div className="flex gap-2 mt-1">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          {convo.product_type}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          convo.payment_status === "paid" 
                            ? "bg-green-50 text-green-700" 
                            : "bg-yellow-50 text-yellow-800"
                        }`}>
                          {convo.payment_status}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => navigate(`/messages/${convo.id}`)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Tips for Applicants */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-5">
              <li>Browse our <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/browse")}>alumni directory</Button> to find mentors who match your interests.</li>
              <li>Purchase a session to unlock direct messaging with your selected alumni.</li>
              <li>After payment, you can message the alumni to schedule a meeting time.</li>
              <li>Prepare specific questions to make the most of your time together.</li>
            </ul>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ApplicantDashboard;
