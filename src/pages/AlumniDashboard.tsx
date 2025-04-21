
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AlumniDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => setProfile(data));
    }
  }, [user]);

  return (
    <div>
      <Navbar />
      <main className="container-custom py-10">
        <h1 className="text-2xl font-bold mb-7">Alumni Dashboard</h1>
        {profile && (
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-5 items-start">
              <img src={profile.image || '/placeholder.svg'} alt={profile.name} className="w-24 h-24 rounded object-cover" />
              <div>
                <div className="font-medium text-xl">{profile.name}</div>
                <div className="text-gray-600 mb-2">{profile.school_id}</div>
                <div className="mb-3">
                  <label className="block font-semibold">Pricing (USD):</label>
                  <div className="flex gap-2 mt-1">
                    <span>15 min</span>
                    <input type="number" className="w-20 px-2 border rounded" value={profile.price_15_min || ""} min="0" placeholder="0" readOnly />
                    <span>30 min</span>
                    <input type="number" className="w-20 px-2 border rounded" value={profile.price_30_min || ""} min="0" placeholder="0" readOnly />
                    <span>60 min</span>
                    <input type="number" className="w-20 px-2 border rounded" value={profile.price_60_min || ""} min="0" placeholder="0" readOnly />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">To update your prices, please contact support.</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Removed booking/earnings extraneous info */}
        <h2 className="mt-8 font-semibold text-lg">Your Conversations</h2>
        <p className="text-gray-600">Messaging, payments, and applicant chats you participate in will appear here soon.</p>
      </main>
      <Footer />
    </div>
  );
};

export default AlumniDashboard;
