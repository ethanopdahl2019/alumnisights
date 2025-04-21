
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  DollarSign,
  Settings,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AlumniDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [isEditingPrices, setIsEditingPrices] = useState(false);
  const [priceState, setPriceState] = useState({
    price_15_min: 0,
    price_30_min: 0,
    price_60_min: 0
  });
  const [isCollapsedMessages, setIsCollapsedMessages] = useState(false);
  
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
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      
      if (!data.featured) {
        // Not an alumni - redirect
        navigate("/applicant-dashboard");
        return;
      }
      
      setProfile(data);
      setPriceState({
        price_15_min: data.price_15_min || 0,
        price_30_min: data.price_30_min || 0,
        price_60_min: data.price_60_min || 0
      });
    };
    
    // Load conversations
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*, applicant:applicant_id(name)")
        .eq("alumni_id", user.id);
        
      if (error) {
        console.error("Error fetching conversations:", error);
        return;
      }
      
      setConversations(data || []);
    };
    
    fetchProfile();
    fetchConversations();
  }, [user, navigate]);
  
  const updatePrices = async () => {
    if (!profile) return;
    
    const { error } = await supabase
      .from("profiles")
      .update({
        price_15_min: priceState.price_15_min,
        price_30_min: priceState.price_30_min,
        price_60_min: priceState.price_60_min
      })
      .eq("id", profile.id);
      
    if (error) {
      toast({
        title: "Error updating prices",
        description: error.message,
        variant: "destructive"
      });
      return;
    }
    
    setIsEditingPrices(false);
    setProfile({
      ...profile,
      ...priceState
    });
    
    toast({
      title: "Prices updated",
      description: "Your product prices have been updated successfully.",
    });
  };
  
  const handlePriceChange = (field: keyof typeof priceState, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setPriceState(prev => ({
      ...prev,
      [field]: numValue
    }));
  };
  
  // Calculate total earnings from paid conversations
  const totalEarnings = conversations
    .filter(c => c.payment_status === "paid")
    .reduce((sum, c) => {
      let price = 0;
      if (c.product_type === "15min") price = profile?.price_15_min || 0;
      if (c.product_type === "30min") price = profile?.price_30_min || 0;
      if (c.product_type === "60min") price = profile?.price_60_min || 0;
      return sum + price;
    }, 0);
  
  return (
    <div>
      <Navbar />
      <main className="container-custom py-10">
        <h1 className="text-2xl font-bold mb-6">Alumni Dashboard</h1>
        
        {profile && (
          <>
            {/* Profile Summary */}
            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <img 
                  src={profile.image || '/placeholder.svg'} 
                  alt={profile.name} 
                  className="w-16 h-16 rounded-full object-cover" 
                />
                <div>
                  <CardTitle>{profile.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    {profile.school_id} • Alumni
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
            
            {/* Pricing Card */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Product Pricing & Earnings
                  </CardTitle>
                  <div className="text-sm font-medium">
                    Total Earnings: ${totalEarnings}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {isEditingPrices ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">15 minute call ($)</label>
                        <Input 
                          type="number" 
                          min="0"
                          value={priceState.price_15_min} 
                          onChange={e => handlePriceChange('price_15_min', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">30 minute call ($)</label>
                        <Input 
                          type="number" 
                          min="0"
                          value={priceState.price_30_min} 
                          onChange={e => handlePriceChange('price_30_min', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">60 minute call ($)</label>
                        <Input 
                          type="number" 
                          min="0"
                          value={priceState.price_60_min} 
                          onChange={e => handlePriceChange('price_60_min', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setIsEditingPrices(false)}>
                        Cancel
                      </Button>
                      <Button onClick={updatePrices}>
                        Save Prices
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="border rounded-md p-3">
                        <div className="text-sm text-gray-500">15 min call</div>
                        <div className="text-lg font-bold">${profile.price_15_min || 0}</div>
                      </div>
                      <div className="border rounded-md p-3">
                        <div className="text-sm text-gray-500">30 min call</div>
                        <div className="text-lg font-bold">${profile.price_30_min || 0}</div>
                      </div>
                      <div className="border rounded-md p-3">
                        <div className="text-sm text-gray-500">60 min call</div>
                        <div className="text-lg font-bold">${profile.price_60_min || 0}</div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => setIsEditingPrices(true)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Edit Pricing
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Messages Card */}
            <Collapsible 
              open={!isCollapsedMessages}
              onOpenChange={(open) => setIsCollapsedMessages(!open)}
              className="mb-8"
            >
              <Card>
                <CardHeader className="pb-3">
                  <CollapsibleTrigger className="flex w-full justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      Conversations ({conversations.length})
                    </CardTitle>
                    {isCollapsedMessages ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronUp className="h-5 w-5" />
                    )}
                  </CollapsibleTrigger>
                </CardHeader>
                
                <CollapsibleContent>
                  <CardContent>
                    {conversations.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        No conversations yet. When applicants purchase your services, they'll appear here.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {conversations.map((convo) => (
                          <div key={convo.id} className="flex items-center justify-between border-b pb-3">
                            <div>
                              <div className="font-medium">{convo.applicant?.name || 'Applicant'}</div>
                              <div className="text-sm text-gray-500">
                                {convo.product_type} • {convo.payment_status}
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
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AlumniDashboard;
