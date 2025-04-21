
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const SchoolMajorLanding = () => {
  const { schoolId, majorId } = useParams();
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [school, setSchool] = useState<any>(null);
  const [major, setMajor] = useState<any>(null);

  useEffect(() => {
    if (!schoolId || !majorId) return;
    const fetchData = async () => {
      const { data: paraData } = await supabase
        .from("school_major_paragraphs")
        .select("*")
        .eq("school_id", schoolId)
        .eq("major_id", majorId);
      setParagraphs((paraData || []).map((p: any) => p.paragraph));

      const { data: schoolData } = await supabase
        .from("schools")
        .select("*")
        .eq("id", schoolId)
        .maybeSingle();
      setSchool(schoolData);

      const { data: majorData } = await supabase
        .from("majors")
        .select("*")
        .eq("id", majorId)
        .maybeSingle();
      setMajor(majorData);
    };
    fetchData();
  }, [schoolId, majorId]);

  return (
    <div>
      <Navbar />
      <main className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-4">
          {school?.name} &middot; {major?.name}
        </h1>
        <div className="space-y-6">
          {paragraphs.length === 0
            ? <p>No insights about this school/major yet.</p>
            : paragraphs.map((p, i) => (
              <div key={i} className="bg-gray-50 p-5 rounded-lg">{p}</div>
            ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default SchoolMajorLanding;
