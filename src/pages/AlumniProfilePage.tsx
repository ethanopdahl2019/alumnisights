
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Tag from "@/components/Tag";
import { motion } from "framer-motion";

const AlumniProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [tags, setTags] = useState<any[]>([]);
  const [school, setSchool] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*, school:schools(*), activities:profile_activities(activities(*))")
        .eq("id", id)
        .maybeSingle();
      if (data) {
        setProfile(data);
        setSchool(data.school);
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

  const products = [
    { label: "Coffee Chat", key: "price_15_min", duration: "15 min" },
    { label: "Q&A Session", key: "price_30_min", duration: "30 min" },
    { label: "In-depth Discussion", key: "price_60_min", duration: "1 hour" }
  ];

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
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left column - Profile info */}
            <div className="md:w-2/3">
              <div className="flex items-start gap-6 mb-8">
                <motion.img
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={profile.image || "/placeholder.svg"}
                  alt={profile.name}
                  className="rounded-full h-32 w-32 object-cover"
                />
                <div>
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl font-bold mb-2"
                  >
                    {profile.name}
                  </motion.h1>
                  <div className="flex items-center gap-3 mb-4">
                    {school?.image && (
                      <img
                        src={school.image}
                        alt={school.name}
                        className="h-8 w-8 object-contain"
                      />
                    )}
                    <div className="text-lg text-gray-700">{school?.name}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Tag key={tag.id} type={tag.type}>{tag.label}</Tag>
                    ))}
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="prose max-w-none mb-8"
              >
                <h2 className="text-xl font-semibold mb-4">About Me</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{profile.bio || "No bio available"}</p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <h2 className="text-xl font-semibold mb-4">Experience & Activities</h2>
                {/* Add experience and activities sections here */}
              </motion.div>
            </div>

            {/* Right column - Booking options */}
            <div className="md:w-1/3">
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-4">Connect with {profile.name.split(' ')[0]}</h2>
                  <p className="text-gray-600 mb-6">
                    Book a session to get personalized insights about {school?.name} and their experience.
                  </p>
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.key} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{product.label}</div>
                            <div className="text-sm text-gray-500">{product.duration}</div>
                          </div>
                          <div className="text-lg font-semibold">${profile[product.key] ?? 0}</div>
                        </div>
                        <Button className="w-full mt-3">
                          Book {product.label}
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AlumniProfilePage;
