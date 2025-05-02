
import React from "react";
import UniversityTemplate from "./UniversityTemplate";

const HarvardUniversity: React.FC = () => {
  return (
    <UniversityTemplate 
      name="Harvard University" 
      content={
        <>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p>
              Harvard University is a private Ivy League research university in Cambridge, Massachusetts. 
              Founded in 1636, it is the oldest institution of higher learning in the United States and 
              one of the most prestigious universities in the world.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Admission Statistics</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Acceptance Rate:</strong> 4% (one of the lowest in the country)</li>
              <li><strong>Average GPA:</strong> 4.18</li>
              <li><strong>SAT Range:</strong> 1460-1580</li>
              <li><strong>ACT Range:</strong> 33-35</li>
              <li><strong>Application Deadline:</strong> January 1</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Application Requirements</h2>
            <p>
              Harvard requires the Common Application or Coalition Application, along with:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Harvard-specific supplemental essays</li>
              <li>Two teacher recommendations</li>
              <li>One counselor recommendation</li>
              <li>School report and transcripts</li>
              <li>Standardized test scores (optional for 2023-2025)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Alumni Insights</h2>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              "Harvard values students who demonstrate intellectual curiosity and a passion for learning beyond classroom requirements. Show authenticity in your essays and highlight what unique perspective you bring to campus."
            </blockquote>
          </section>
        </>
      } 
    />
  );
};

export default HarvardUniversity;
