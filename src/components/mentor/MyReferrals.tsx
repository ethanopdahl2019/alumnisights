
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

interface Referral {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  status: "pending" | "joined" | "expired";
}

const MyReferrals = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("mentor_referrals")
          .select("*")
          .eq("referrer_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setReferrals(data || []);
      } catch (error) {
        console.error("Error fetching referrals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [user]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "joined":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Referrals</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        ) : referrals.length > 0 ? (
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div 
                key={referral.id}
                className="border rounded-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div>
                  <p className="font-medium">{referral.first_name} {referral.last_name}</p>
                  <p className="text-sm text-gray-500">{referral.email}</p>
                  <p className="text-xs text-gray-400">
                    Invited {new Date(referral.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span 
                  className={`text-xs px-2 py-1 rounded-full mt-2 sm:mt-0 ${getStatusBadgeClass(referral.status)}`}
                >
                  {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-center py-4">
            You haven't referred any alumni yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MyReferrals;
