import React from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface UniversityContentProps {
  content: {
    overview?: string;
    admissionStats?: string;
    chartData?: Array<{ year: number; acceptanceRate: number }>;
    applicationRequirements?: string;
    alumniInsights?: string;
  };
  image?: string;
  name: string;
  didYouKnow?: string;
}

const UniversityContent: React.FC<UniversityContentProps> = ({ content, image, name, didYouKnow }) => {
  const hasBulletPoints = content?.admissionStats?.includes("•") || 
                         content?.admissionStats?.includes("-") ||
                         content?.admissionStats?.includes("*");

  // Format the admission stats text into bullet points if not already formatted
  const formatAdmissionStats = () => {
    if (!content?.admissionStats) return null;
    
    // If the content already has bullet points, render it as is
    if (hasBulletPoints) {
      return (
        <div className="whitespace-pre-line">
          {content.admissionStats}
        </div>
      );
    }
    
    // Otherwise, try to create bullet points from paragraphs
    const paragraphs = content.admissionStats.split("\n").filter(p => p.trim() !== "");
    
    return (
      <ul className="list-disc pl-5 space-y-2">
        {paragraphs.map((paragraph, index) => (
          <li key={index}>{paragraph}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="mt-6 space-y-8">
      {content?.overview && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="whitespace-pre-line">{content.overview}</p>
        </section>
      )}

      {content?.admissionStats && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Admission Statistics</h2>
          
          {/* Render admission stats as bullet points */}
          {formatAdmissionStats()}
          
          {/* Render chart if we have chart data */}
          {content.chartData && content.chartData.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Acceptance Rate Trends</h3>
              <div className="w-full h-64 bg-white p-4 rounded-lg border">
                <ChartContainer 
                  className="w-full" 
                  config={{
                    acceptanceRate: { label: "Acceptance Rate (%)" }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={content.chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis 
                        domain={[0, 'dataMax + 5']} 
                        tickFormatter={(value) => `${value}%`}
                      />
                      <ChartTooltip 
                        content={
                          <ChartTooltipContent 
                            labelFormatter={(value) => `Year: ${value}`} 
                            formatter={(value) => [`${value}%`, 'Acceptance Rate']}
                          />
                        } 
                      />
                      <Bar 
                        dataKey="acceptanceRate" 
                        name="acceptanceRate"
                        fill="#2563eb" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          )}
        </section>
      )}

      {didYouKnow && (
        <div className="my-6 bg-purple-50 border border-purple-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-purple-800 mb-3">Did You Know?</h3>
          <p className="text-sm text-purple-900">{didYouKnow}</p>
        </div>
      )}

      {content?.applicationRequirements && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Application Requirements</h2>
          <p className="whitespace-pre-line">{content.applicationRequirements}</p>
        </section>
      )}

      {content?.alumniInsights && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Alumni Insights</h2>
          <p className="whitespace-pre-line">{content.alumniInsights}</p>
        </section>
      )}
    </div>
  );
};

export default UniversityContent;
