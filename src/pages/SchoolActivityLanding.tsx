
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const SchoolActivityLanding = () => {
  const { schoolId, activityId } = useParams();
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [school, setSchool] = useState<any>(null);
  const [activity, setActivity] = useState<any>(null);

  useEffect(() => {
    if (!schoolId || !activityId) return;
    const fetchData = async () => {
      const { data: paraData } = await supabase
        .from("school_activity_paragraphs")
        .select("*")
        .eq("school_id", schoolId)
        .eq("activity_id", activityId);
      setParagraphs((paraData || []).map((p: any) => p.paragraph));

      const { data: schoolData } = await supabase
        .from("schools")
        .select("*")
        .eq("id", schoolId)
        .maybeSingle();
      setSchool(schoolData);

      const { data: actData } = await supabase
        .from("activities")
        .select("*")
        .eq("id", activityId)
        .maybeSingle();
      setActivity(actData);
    };
    fetchData();
  }, [schoolId, activityId]);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="container-custom py-12">
        <h1 className="text-3xl font-serif font-medium mb-6">
          {school?.name} &middot; {activity?.name}
        </h1>
        <div className="space-y-6">
          {paragraphs.length === 0
            ? <p className="text-lg font-sans text-gray-700">No insights about this school/activity yet.</p>
            : paragraphs.map((p, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-lg border border-gray-100 font-sans">{p}</div>
            ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default SchoolActivityLanding;
