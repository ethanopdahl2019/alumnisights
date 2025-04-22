
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
      <main className="container-custom py-10 max-w-2xl mx-auto">
        <Card className="p-8 mb-8">
          <div className="flex flex-col items-center gap-4">
            <img
              src={profile.image || "/placeholder.svg"}
              alt={profile.name}
              className="rounded-full h-32 w-32 object-cover mb-4"
            />
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <div className="text-lg text-gray-700">{school?.name}</div>
            <div className="flex flex-wrap gap-2 my-3">
              {tags.map(tag => (
                <Tag key={tag.id} type={tag.type}>{tag.label}</Tag>
              ))}
            </div>
            <div className="space-y-4 w-full mt-6">
              {products.map((product) => (
                <div key={product.key} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{product.label}</div>
                    <div className="text-gray-500 text-sm">{product.duration}</div>
                  </div>
                  <div className="font-bold text-lg">${profile[product.key] ?? 0}</div>
                  <Button onClick={() => handleCheckout(product)}>
                    Book & Checkout
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};
export default AlumniProfilePage;
