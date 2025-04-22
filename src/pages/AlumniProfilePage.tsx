
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Tag from "@/components/Tag";

const AlumniProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [tags, setTags] = useState<any[]>([]);
  const [school, setSchool] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, school:schools(*), activities:profile_activities(activities(*))")
        .eq("id", id)
        .maybeSingle();
      if (data) {
        setProfile(data);
        setSchool(data.school);
        // Extract tags
        setTags(
          (data.activities || []).map((a: any) => ({
            id: a.activities.id,
            label: a.activities.name,
            type: a.activities.type
          }))
        );
      }
    };
    fetchProfile();
  }, [id]);

  // Display 3 products with pricing
  const products = [
    { label: "Coffee Chat", key: "price_15_min", duration: "15 min" },
    { label: "Q&A Session", key: "price_30_min", duration: "30 min" },
    { label: "In-depth Discussion", key: "price_60_min", duration: "1 hour" }
  ];

  // TODO: Wire up Stripe Checkout
  const handleCheckout = (product: any) => {
    alert(`Stripe Checkout for: ${product.label} at $${profile[product.key] || 0}`);
    // navigate to Stripe checkout, passing product and profile/alumni info
  };

  if (!profile) {
    return (
      <div>
        <Navbar />
        <main className="container-custom py-8 text-center">
          <p>Loading alumni profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="container-custom py-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <Card className="p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="md:w-1/3 flex flex-col items-center">
                <img
                  src={profile?.image || "/placeholder.svg"}
                  alt={profile?.name}
                  className="rounded-full h-40 w-40 object-cover mb-4"
                />
                {school && (
                  <div className="flex items-center gap-3 mt-2">
                    <img 
                      src={school.image || "/placeholder.svg"} 
                      alt={school.name} 
                      className="h-12 w-12 object-contain"
                    />
                    <div className="text-lg font-medium text-navy">{school.name}</div>
                  </div>
                )}
              </div>
              
              <div className="md:w-2/3">
                <h1 className="text-3xl font-bold mb-2">{profile?.name}</h1>
                <p className="text-gray-600 mb-4">{profile?.bio}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map(tag => (
                    <Tag key={tag.id} type={tag.type}>{tag.label}</Tag>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Booking Options */}
          <Card className="p-8">
            <h2 className="text-xl font-medium mb-6">Connect with {profile?.name}</h2>
            <div className="space-y-4">
              {products.map((product) => (
                <div 
                  key={product.key} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:border-navy/30 transition-colors"
                >
                  <div>
                    <div className="font-medium">{product.label}</div>
                    <div className="text-sm text-gray-500">{product.duration}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl mb-1">${profile?.[product.key] ?? 0}</div>
                    <Button 
                      onClick={() => handleCheckout(product)}
                      size="sm"
                    >
                      Book Session
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AlumniProfilePage;
