
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ApplicantDashboard = () => {
  const { user } = useAuth();
  const [convos, setConvos] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      supabase
        .from("conversations")
        .select("*, alumni:alumni_id(name)")
        .eq("applicant_id", user.id)
        .then(({ data }) => setConvos(data || []));
    }
  }, [user]);

  return (
    <div>
      <Navbar />
      <main className="container-custom py-10">
        <h1 className="text-2xl font-bold mb-6">Applicant Dashboard</h1>
        <div>
          <h2 className="font-semibold text-lg mb-3">Paid Alumni Conversations</h2>
          <ul>
            {convos.map((c) => (
              <li key={c.id} className="mb-4 border rounded-lg p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center">
                <span className="font-medium text-navy">{c?.alumni?.name || c.alumni_id}</span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">{c.product_type}</span>
                <span className={`px-2 py-1 rounded text-xs ${c.payment_status === "paid" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-800"}`}>
                  {c.payment_status}
                </span>
                <a className="ml-auto px-3 py-1 rounded bg-navy text-white text-xs hover:bg-navy/90" href={`/messages/${c.id}`}>
                  Message
                </a>
              </li>
            ))}
          </ul>
        </div>
        <h2 className="mt-8 font-semibold text-lg">Progress Tracker</h2>
        <div className="my-2 p-4 bg-gray-50 border rounded">Progress features coming soon!</div>
      </main>
      <Footer />
    </div>
  );
};

export default ApplicantDashboard;
