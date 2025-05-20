
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UniversityHeader from "./universities/components/UniversityHeader";
import UniversityContent from "./universities/components/UniversityContent";
import UniversityNotFound from "./universities/components/UniversityNotFound";
import { universities } from "./universities/university-data";
import { supabase } from "@/integrations/supabase/client";
import AdmissionStats, { AdmissionStatsType } from "@/components/insights/AdmissionStats";

const UniversityAdmissions = () => {
  const { id } = useParams<{ id: string }>();
  const university = id ? universities[id] : null;
  const [admissionStats, setAdmissionStats] = useState<AdmissionStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch admission statistics
  useEffect(() => {
    if (!id) return;

    const fetchAdmissionStats = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get_university_admission_stats', {
          body: { university_id: id }
        });

        if (error) {
          console.error('Error fetching admission stats:', error);
        } else if (data) {
          setAdmissionStats({
            acceptanceRate: data.acceptance_rate,
            averageSAT: data.average_sat,
            averageACT: data.average_act
          });
        }
      } catch (error) {
        console.error('Failed to fetch admission stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissionStats();
  }, [id]);

  if (!university) {
    return <UniversityNotFound />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{university.title} | AlumniSights</title>
        <meta name="description" content={`Learn how to get admitted to ${university.name}`} />
      </Helmet>
      
      <Navbar />
      
      <main className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <UniversityHeader title={university.title} />
          
          {/* Display admission stats when available */}
          {!loading && admissionStats && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Admission Statistics</h2>
              <AdmissionStats stats={admissionStats} />
            </div>
          )}
          
          <UniversityContent 
            content={university.content}
            image={university.image}
            name={university.name}
            didYouKnow={university.didYouKnow}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UniversityAdmissions;
