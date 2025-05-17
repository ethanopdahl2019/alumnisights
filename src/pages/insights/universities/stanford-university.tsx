
import React from "react";
import UniversityTemplate from "./UniversityTemplate";

const StanfordUniversity: React.FC = () => {
  return (
    <UniversityTemplate 
      name="Stanford University" 
      image="https://images.unsplash.com/photo-1531924442192-29c5c7d952bc?q=80&w=1920&auto=format&fit=crop"
      content={
        <>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p>
              Stanford University is a private research university in Stanford, California. Founded in 1885, 
              Stanford is known for its academic strength, wealth, proximity to Silicon Valley, and ranking 
              as one of the world's top universities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Admission Statistics</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Acceptance Rate:</strong> 3.9%</li>
              <li><strong>Average GPA:</strong> 3.96</li>
              <li><strong>SAT Range:</strong> 1440-1570</li>
              <li><strong>ACT Range:</strong> 32-35</li>
              <li><strong>Application Deadline:</strong> January 5</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Application Requirements</h2>
            <p>
              Stanford requires the Common Application or Coalition Application, along with:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Stanford-specific essays (3-4 short essays)</li>
              <li>Letters of recommendation from two teachers</li>
              <li>School report and counselor recommendation</li>
              <li>Mid-year report</li>
              <li>Standardized test scores (optional)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Alumni Insights</h2>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              "Stanford looks for intellectual vitality and demonstrated excellence in extracurricular pursuits. Highlight your innovative thinking and how you've made an impact in your community."
            </blockquote>
          </section>
        </>
      } 
    />
  );
};

export default StanfordUniversity;
