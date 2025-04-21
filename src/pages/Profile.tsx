
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Tag from "@/components/Tag";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [school, setSchool] = useState<any>(null);
  const [major, setMajor] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;

      try {
        // Fetch profile with details
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch school
        if (profileData.school_id) {
          const { data: schoolData } = await supabase
            .from("schools")
            .select("*")
            .eq("id", profileData.school_id)
            .single();
          setSchool(schoolData);
        }

        // Fetch major
        if (profileData.major_id) {
          const { data: majorData } = await supabase
            .from("majors")
            .select("*")
            .eq("id", profileData.major_id)
            .single();
          setMajor(majorData);
        }

        // Fetch activities
        const { data: activityData } = await supabase
          .from("profile_activities")
          .select("activities(*)")
          .eq("profile_id", id);

        if (activityData) {
          setActivities(activityData.map(item => item.activities));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, toast]);

  const handleProductSelect = async (productType: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to purchase this product",
        variant: "default",
      });
      navigate("/auth");
      return;
    }

    setSelectedProduct(productType);
  };

  const handleCheckout = async () => {
    if (!user || !profile || !selectedProduct) return;
    
    setProcessing(true);
    
    try {
      // First check if the user already has a conversation with this alumni
      const { data: existingConvo } = await supabase
        .from("conversations")
        .select("id")
        .eq("applicant_id", user.id)
        .eq("alumni_id", profile.user_id)
        .eq("product_type", selectedProduct)
        .maybeSingle();
      
      if (existingConvo) {
        navigate(`/messages/${existingConvo.id}`);
        return;
      }
      
      // Create a new conversation
      const { data: newConvo, error: convoError } = await supabase
        .from("conversations")
        .insert({
          applicant_id: user.id,
          alumni_id: profile.user_id,
          product_type: selectedProduct,
          payment_status: "paid" // For now, setting as paid immediately (would integrate with Stripe in production)
        })
        .select("id")
        .single();
      
      if (convoError) throw convoError;
      
      toast({
        title: "Purchase Successful",
        description: "You can now message this alumni",
      });
      
      // Redirect to messages
      navigate(`/messages/${newConvo.id}`);
    } catch (error) {
      console.error("Error during checkout:", error);
      toast({
        title: "Checkout Failed",
        description: "There was a problem processing your request",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container-custom py-20 text-center">
          <p>Loading profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <Navbar />
        <div className="container-custom py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p>The profile you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-6" onClick={() => navigate("/browse")}>
            Browse Profiles
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="container-custom py-10">
        <div className="max-w-4xl mx-auto">
          {/* Alumni Header */}
          <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <img
                src={profile.image || "/placeholder.svg"}
                alt={profile.name}
                className="w-48 h-48 rounded-full object-cover shadow-md border-4 border-white"
              />
            </div>
            
            <div className="w-full md:w-2/3">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              
              {school && (
                <div className="text-lg text-gray-600 mt-1">
                  {school.name}
                </div>
              )}
              
              {major && (
                <div className="mt-3">
                  <Tag type="major">{major.name}</Tag>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mt-4">
                {activities.map((activity, index) => (
                  <Tag key={index} type={activity.type}>
                    {activity.name}
                  </Tag>
                ))}
              </div>
              
              {profile.bio && (
                <div className="mt-6 text-gray-700">
                  <h2 className="text-lg font-medium mb-2">About</h2>
                  <p>{profile.bio}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Product Cards */}
          <h2 className="text-xl font-bold mb-4">Services Offered</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {/* 15 min Product */}
            <Card className={`${selectedProduct === "15min" ? "ring-2 ring-blue-500" : ""}`}>
              <CardHeader>
                <CardTitle>15 Minute Call</CardTitle>
                <CardDescription>Quick questions & introductions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${profile.price_15_min || 0}</div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> 
                    Brief introduction
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> 
                    Quick application review
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> 
                    1-2 targeted questions
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleProductSelect("15min")}
                  disabled={!profile.price_15_min}
                >
                  {!profile.price_15_min ? "Not Available" : "Select"}
                </Button>
              </CardFooter>
            </Card>
            
            {/* 30 min Product */}
            <Card className={`${selectedProduct === "30min" ? "ring-2 ring-blue-500" : ""}`}>
              <CardHeader>
                <CardTitle>30 Minute Call</CardTitle>
                <CardDescription>Detailed discussion & advice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${profile.price_30_min || 0}</div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> 
                    In-depth conversation
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> 
                    Application strategy
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> 
                    Answer multiple questions
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleProductSelect("30min")}
                  disabled={!profile.price_30_min}
                >
                  {!profile.price_30_min ? "Not Available" : "Select"}
                </Button>
              </CardFooter>
            </Card>
            
            {/* 60 min Product */}
            <Card className={`${selectedProduct === "60min" ? "ring-2 ring-blue-500" : ""}`}>
              <CardHeader>
                <CardTitle>60 Minute Call</CardTitle>
                <CardDescription>Comprehensive consultation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${profile.price_60_min || 0}</div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> 
                    Full application review
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> 
                    Essay feedback & guidance
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> 
                    Comprehensive advice
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleProductSelect("60min")}
                  disabled={!profile.price_60_min}
                >
                  {!profile.price_60_min ? "Not Available" : "Select"}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Checkout Section */}
          {selectedProduct && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Complete Your Purchase</CardTitle>
                <CardDescription>
                  You're purchasing a {selectedProduct} call with {profile.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                  <div>
                    <div className="font-medium">{selectedProduct} Call</div>
                    <div className="text-sm text-gray-500">
                      Access to messaging and scheduling
                    </div>
                  </div>
                  <div className="text-xl font-bold">
                    ${selectedProduct === "15min" 
                        ? profile.price_15_min 
                        : selectedProduct === "30min" 
                          ? profile.price_30_min 
                          : profile.price_60_min}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedProduct(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Complete Purchase"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
