
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AlumniDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState({
    price_15_min: 0,
    price_30_min: 0,
    price_60_min: 0
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchData = async () => {
      try {
        // Check if user is an alumni
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError) throw profileError;

        if (profileData.role !== "alumni") {
          toast({
            title: "Access denied",
            description: "This dashboard is only for alumni users",
            variant: "destructive"
          });
          navigate("/applicant-dashboard");
          return;
        }

        setProfile(profileData);
        setPrices({
          price_15_min: profileData.price_15_min || 0,
          price_30_min: profileData.price_30_min || 0,
          price_60_min: profileData.price_60_min || 0
        });

        // Fetch conversations
        const { data: conversationsData, error: conversationsError } = await supabase
          .from("conversations")
          .select(`
            *,
            applicant:applicant_id(id, name, user_id, image)
          `)
          .eq("alumni_id", profileData.id)
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

  const updatePrices = async () => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          price_15_min: prices.price_15_min,
          price_30_min: prices.price_30_min,
          price_60_min: prices.price_60_min
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast({
        title: "Prices updated",
        description: "Your conversation prices have been updated successfully"
      });
    } catch (error) {
      console.error("Error updating prices:", error);
      toast({
        title: "Error",
        description: "Failed to update prices",
        variant: "destructive"
      });
    }
  };

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
        <h1 className="text-3xl font-bold mb-6">Alumni Dashboard</h1>

        <Tabs defaultValue="conversations" className="mb-10">
          <TabsList className="mb-4">
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="conversations">
            <Card>
              <CardHeader>
                <CardTitle>Your Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                {conversations.length === 0 ? (
                  <p className="text-gray-500 py-4">No conversations yet</p>
                ) : (
                  <div className="space-y-4">
                    {conversations.map((conversation) => (
                      <div 
                        key={conversation.id} 
                        className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/messages/${conversation.id}`)}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                            {conversation.applicant?.image && (
                              <img 
                                src={conversation.applicant.image} 
                                alt={conversation.applicant.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{conversation.applicant?.name || "Unnamed"}</h3>
                            <p className="text-sm text-gray-500">{conversation.product_type}</p>
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
          </TabsContent>

          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Set Your Prices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 max-w-md">
                  <div>
                    <label className="block text-sm font-medium mb-1">15-Minute Chat (USD)</label>
                    <Input
                      type="number"
                      min="0"
                      value={prices.price_15_min}
                      onChange={(e) => setPrices({...prices, price_15_min: Number(e.target.value)})}
                      placeholder="15"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">30-Minute Chat (USD)</label>
                    <Input
                      type="number"
                      min="0"
                      value={prices.price_30_min}
                      onChange={(e) => setPrices({...prices, price_30_min: Number(e.target.value)})}
                      placeholder="30"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">60-Minute Chat (USD)</label>
                    <Input
                      type="number"
                      min="0"
                      value={prices.price_60_min}
                      onChange={(e) => setPrices({...prices, price_60_min: Number(e.target.value)})}
                      placeholder="60"
                    />
                  </div>
                  
                  <Button onClick={updatePrices}>
                    Save Prices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <Card>
              <CardHeader>
                <CardTitle>Your Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-500 mb-2">Total Earnings</p>
                    <p className="text-3xl font-bold">$0</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-500 mb-2">Conversations</p>
                    <p className="text-3xl font-bold">{conversations.length}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-500 mb-2">Paid Conversations</p>
                    <p className="text-3xl font-bold">
                      {conversations.filter(c => c.payment_status === "paid").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default AlumniDashboard;
