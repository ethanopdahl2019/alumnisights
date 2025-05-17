
import React from 'react';
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import UniversityTemplate from "./UniversityTemplate";
import { getUniversityById } from "@/services/universities"; 
import { getUniversityContent } from "@/services/landing-page";
import { UniversityContent } from "@/types/database";
import { UniversityData } from "./universities-data";

const UniversityPage: React.FC = () => {
  // Get ID from params or extract from pathname if needed
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [content, setContent] = useState<UniversityContent | null>(null);
  const [universityData, setUniversityData] = useState<UniversityData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  
  // Extract university ID from pathname if not in params
  const getUniversityId = () => {
    if (id) return id;
    
    // Extract ID from pathname for static routes
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // Handle cases like "stanford-university", "harvard-university", etc.
    if (lastSegment.includes('-university') || lastSegment.includes('-college')) {
      return lastSegment;
    }
    
    return null;
  };
  
  const universityId = getUniversityId();
  
  useEffect(() => {
    const loadData = async () => {
      if (universityId) {
        try {
          setIsLoading(true);
          
          // Fetch university content
          const contentData = await getUniversityContent(universityId);
          if (contentData) {
            setContent(contentData);
          }
          
          // Fetch university data
          const university = await getUniversityById(universityId);
          if (university) {
            setUniversityData({
              id: university.id,
              name: university.name,
              type: university.type || undefined,
              state: university.state || undefined
            });
          }
        } catch (error) {
          console.error("Error loading university data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadData();
  }, [universityId]);
  
  if (isLoading) {
    return <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-[40vh] bg-gray-300 rounded-md mb-8"></div>
          <div className="h-8 bg-gray-300 w-3/4 rounded-md mb-4"></div>
          <div className="h-4 bg-gray-300 w-1/2 rounded-md mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-300 rounded-md"></div>
            ))}
          </div>
        </div>
      </div>
    </div>;
  }
  
  if (!universityData && !content) {
    return <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">University not found</h1>
        <p className="text-gray-600">The university you're looking for could not be found.</p>
      </div>
    </div>;
  }
  
  const universityName = content?.name || universityData?.name || "";
  const universityLogo = content?.logo || null;
  const universityImage = content?.image || null;
  const universityDidYouKnow = content?.did_you_know || null;
  
  // Check if the user is an admin
  const isAdmin = user?.user_metadata?.role === 'admin';
  
  // Build content sections for display
  const contentSections = (
    <>
      {content ? (
        <>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="whitespace-pre-line">{content.overview}</p>
          </section>
          
          {content.admission_stats && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Admission Statistics</h2>
              <p className="whitespace-pre-line">{content.admission_stats}</p>
            </section>
          )}
          
          {content.application_requirements && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Application Requirements</h2>
              <p className="whitespace-pre-line">{content.application_requirements}</p>
            </section>
          )}
          
          {content.alumni_insights && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Alumni Insights</h2>
              <p className="whitespace-pre-line">{content.alumni_insights}</p>
            </section>
          )}
        </>
      ) : universityData?.type ? (
        <p className="mb-4">{universityData.type}</p>
      ) : (
        <p className="mb-4">No information available for this university.</p>
      )}
    </>
  );
  
  return (
    <UniversityTemplate 
      name={universityName}
      logo={universityLogo}
      image={universityImage}
      content={contentSections}
      showEditButton={isAdmin && universityId ? true : false}
      id={universityId || undefined}
      didYouKnow={universityDidYouKnow}
    />
  );
};

export default UniversityPage;
