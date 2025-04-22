
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  const [experiences, setExperiences] = useState<any[]>([]);

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

      // Fetch experiences (sample data for now)
      setExperiences([
        { 
          id: 1, 
          title: "Research Assistant", 
          organization: "Biology Department", 
          description: "Conducted research on environmental impacts on marine life",
          year: "2022 - Present"
        },
        { 
          id: 2, 
          title: "Teaching Assistant", 
          organization: "Computer Science Department", 
          description: "Assisted in teaching introductory programming courses",
          year: "2021 - 2022"
        }
      ]);
    };
    fetchProfile();
  }, [id]);

  // Display 3 products with pricing
  const products = [
    { label: "Coffee Chat", key: "price_15_min", duration: "15 min" },
    { label: "Q&A Session", key: "price_30_min", duration: "30 min" },
    { label: "In-depth Discussion", key: "price_60_min", duration: "1 hour" }
  ];

  // Handle checkout
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
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Left sidebar with profile information */}
            <motion.div 
              className="md:col-span-1"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="p-6 sticky top-24">
                <div className="flex flex-col items-center">
                  <img
                    src={profile.image || "/placeholder.svg"}
                    alt={profile.name}
                    className="rounded-full h-32 w-32 object-cover mb-4"
                  />
                  <h1 className="text-2xl font-bold text-center">{profile.name}</h1>
                  
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {school?.image && (
                      <img 
                        src={school.image} 
                        alt={school.name} 
                        className="h-6 w-auto object-contain"
                      />
                    )}
                    <div className="text-lg text-gray-700 font-medium">{school?.name}</div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center my-4">
                    {tags.map(tag => (
                      <Tag key={tag.id} type={tag.type}>{tag.label}</Tag>
                    ))}
                  </div>
                  
                  <div className="mt-6 w-full">
                    <h3 className="font-semibold mb-3 text-gray-700">Book a Conversation</h3>
                    {products.map((product) => (
                      <div key={product.key} className="mb-2 text-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span>{product.label} ({product.duration})</span>
                          <span className="font-semibold">${profile[product.key] ?? 0}</span>
                        </div>
                      </div>
                    ))}
                    <Button 
                      onClick={() => handleCheckout(products[0])} 
                      className="w-full mt-3"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            {/* Main content area */}
            <motion.div 
              className="md:col-span-2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {/* Bio section */}
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">About Me</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {profile.bio || "No bio information available."}
                </p>
              </Card>
              
              {/* Experience section */}
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Experience</h2>
                {experiences.length > 0 ? (
                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="border-b pb-4 last:border-0">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{exp.title}</h3>
                          <span className="text-sm text-gray-500">{exp.year}</span>
                        </div>
                        <p className="text-gray-600">{exp.organization}</p>
                        <p className="text-sm mt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No experience information available.</p>
                )}
              </Card>
              
              {/* What I can help with section */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">How I Can Help</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Insider information about campus life and culture</li>
                  <li>Application guidance and essay review</li>
                  <li>Course selection and academic advice</li>
                  <li>Career planning and networking opportunities</li>
                  <li>Extracurricular activity recommendations</li>
                </ul>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AlumniProfilePage;
