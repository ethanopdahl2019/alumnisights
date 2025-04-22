
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ProfileWithDetails } from "@/types/database";
import ProfileCard from "@/components/ProfileCard";
import { getAllProfiles } from "@/services/profiles";

const ApplicantDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recommendedAlumni, setRecommendedAlumni] = useState<ProfileWithDetails[]>([]);

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

        // Get recommended alumni
        const allProfiles = await getAllProfiles();
        const alumni = allProfiles.filter(p => p.role === "alumni").slice(0, 3);
        setRecommendedAlumni(alumni);
        
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
        <motion.h1 
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Applicant Dashboard
        </motion.h1>

        <motion.section 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Welcome to AlumniSights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Connect with students and alumni to gain unique insights about your target schools. 
                Learn about campus culture, academic programs, and get application advice from those 
                who've been through the process.
              </p>
              <button 
                onClick={() => navigate("/browse")}
                className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
              >
                Browse Alumni
              </button>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Recommended Alumni</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedAlumni.length > 0 ? (
              recommendedAlumni.map(alumni => (
                <ProfileCard key={alumni.id} profile={alumni} />
              ))
            ) : (
              <div className="text-center py-8 col-span-full">
                <p className="text-gray-500 mb-4">Explore alumni profiles to find your perfect match</p>
                <button 
                  onClick={() => navigate("/browse")}
                  className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
                >
                  Browse All Alumni
                </button>
              </div>
            )}
          </div>
        </motion.section>
      </div>
      <Footer />
    </div>
  );
};

export default ApplicantDashboard;
