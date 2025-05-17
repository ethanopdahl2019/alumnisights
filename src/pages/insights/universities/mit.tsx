
import React from "react";
import UniversityTemplate from "./UniversityTemplate";

const MITUniversity: React.FC = () => {
  return (
    <UniversityTemplate 
      name="Massachusetts Institute of Technology (MIT)" 
      image="https://images.unsplash.com/photo-1612967206782-5cc8b5dca1d8?q=80&w=1920&auto=format&fit=crop"
      content={
        <>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p>
              The Massachusetts Institute of Technology (MIT) is a private land-grant research university in Cambridge, Massachusetts. 
              Established in 1861, MIT has played a key role in the development of modern technology and science and is renowned for its 
              rigorous academic programs in engineering, physical sciences, and other areas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Admission Statistics</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Acceptance Rate:</strong> 4%</li>
              <li><strong>Average GPA:</strong> 4.17</li>
              <li><strong>SAT Range:</strong> 1510-1580</li>
              <li><strong>ACT Range:</strong> 34-36</li>
              <li><strong>Application Deadline:</strong> January 5</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Application Requirements</h2>
            <p>
              MIT has its own application system and requires:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>MIT-specific application (not Common App)</li>
              <li>MIT-specific essays and short answers</li>
              <li>Two teacher recommendations (one math/science, one humanities)</li>
              <li>Secondary school report and transcripts</li>
              <li>Mid-year report</li>
              <li>Standardized testing (optional for 2023-2025 cycles)</li>
              <li>Maker Portfolio (optional but recommended for students with technical projects)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Alumni Insights</h2>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              "MIT values problem-solvers and creative thinkers. Demonstrate how you've used technical skills to solve real-world problems and show your collaborative spirit."
            </blockquote>
          </section>
        </>
      } 
    />
  );
};

export default MITUniversity;
