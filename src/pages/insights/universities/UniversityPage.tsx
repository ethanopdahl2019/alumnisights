
import React from 'react';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import UniversityTemplate from "./UniversityTemplate";
import { universities } from "./universities-data";
import { getUniversityContent } from "@/services/landing-page";
import { UniversityContent } from "@/types/database";

const UniversityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState<UniversityContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth(); // Use auth to check for admin status
  
  // Find university data from static data
  const universityData = id ? universities.find(uni => uni.id === id) : null;
  
  useEffect(() => {
    const loadContent = async () => {
      if (id) {
        try {
          const data = await getUniversityContent(id);
          if (data) {
            setContent(data);
          }
        } catch (error) {
          console.error("Error loading university content:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadContent();
  }, [id]);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!universityData && !content) {
    return <div>University not found</div>;
  }
  
  const universityName = content?.name || universityData?.name || "";
  const universityLogo = content?.logo || universityData?.logo || null;
  const universityImage = content?.image || null;
  
  // Check if the user is an admin
  const isAdmin = user?.user_metadata?.role === 'admin';
  
  // Build content sections for display
  const contentSections = (
    <>
      {content ? (
        <>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <div className="md:flex">
              <div className="md:w-2/3 pr-6">
                <p className="whitespace-pre-line">{content.overview}</p>
              </div>
              {universityImage && (
                <div className="md:w-1/3 mt-4 md:mt-0">
                  <img 
                    src={universityImage} 
                    alt={content.name}
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Admission Statistics</h2>
            <p className="whitespace-pre-line">{content.admission_stats}</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Application Requirements</h2>
            <p className="whitespace-pre-line">{content.application_requirements}</p>
          </section>
          
          {content.alumni_insights && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Alumni Insights</h2>
              <p className="whitespace-pre-line">{content.alumni_insights}</p>
            </section>
          )}
        </>
      ) : universityData?.description ? (
        <p className="mb-4">{universityData.description}</p>
      ) : null}
    </>
  );
  
  return (
    <UniversityTemplate 
      name={universityName}
      logo={universityLogo}
      content={contentSections}
      showEditButton={isAdmin} // Only show edit button for admins
    />
  );
};

export default UniversityPage;
