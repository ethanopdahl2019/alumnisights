import React, { useEffect, useState } from "react";
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
import ConversationPreview from "@/components/ConversationPreview";
import { Conversation } from "@/types/database";

const AlumniDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
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

        const { data: conversationsData, error: conversationsError } = await supabase
          .from("conversations")
          .select(`
            id,
            applicant_id,
            product_type,
            payment_status,
            updated_at,
            applicant:profiles!conversations_applicant_id_fkey(
              id, 
              name, 
              image
            )
          `)
          .eq("alumni_id", profileData.id)
          .order("updated_at", { ascending: false });

        if (conversationsError) throw conversationsError;

        const conversationsWithLastMessage: Conversation[] = await Promise.all(
          (conversationsData || []).map(async (conv: any) => {
            const { data: lastMessageData } = await supabase
              .from("messages")
              .select("content, created_at")
              .eq("conversation_id", conv.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .single();

            return {
              ...conv,
              last_message: lastMessageData || undefined,
            };
          })
        );

        setConversations(conversationsWithLastMessage);
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
                      <ConversationPreview
                        key={conversation.id}
                        id={conversation.id}
                        otherUser={{
                          name: conversation.applicant.name || "Unnamed",
                          image: conversation.applicant.image
                        }}
                        lastMessage={conversation.last_message?.content}
                        timestamp={conversation.last_message?.created_at || conversation.updated_at}
                        paymentStatus={conversation.payment_status}
                        productType={conversation.product_type}
                      />
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
                      {conversations.filter(c => c.payment_status === "completed" || c.payment_status === "free").length}
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
