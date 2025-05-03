
import React from "react";
import UniversityTemplate from "./UniversityTemplate";

const AuburnUniversity: React.FC = () => {
  return (
    <UniversityTemplate
      name="Auburn University"
      content={
        <>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">About Auburn University</h2>
            <p className="mb-4">
              Auburn University is a public land-grant research university in Auburn, Alabama. 
              Founded in 1856, it is one of the state's flagship public universities and has a rich 
              history of academic excellence and tradition.
            </p>
            <p>
              Known for its strong programs in engineering, business, and agriculture, Auburn 
              combines rigorous academics with a vibrant campus culture and competitive athletics program.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Admission Statistics</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Acceptance Rate: 81%</li>
              <li>Average GPA: 3.9</li>
              <li>SAT Range: 1150-1320</li>
              <li>ACT Range: 25-31</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Application Requirements</h2>
            <p className="mb-4">
              Auburn University evaluates applicants based on academic achievements, standardized test scores, 
              and potential to contribute to the campus community.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Auburn application or Common Application</li>
              <li>Official high school transcript</li>
              <li>SAT or ACT scores</li>
              <li>Application fee</li>
            </ul>
          </section>
        </>
      }
    />
  );
};

export default AuburnUniversity;
