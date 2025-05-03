
import React from "react";
import UniversityTemplate from "./UniversityTemplate";

const AppalachianStateUniversity: React.FC = () => {
  return (
    <UniversityTemplate
      name="Appalachian State University"
      content={
        <>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">About Appalachian State University</h2>
            <p className="mb-4">
              Appalachian State University is a public university located in Boone, North Carolina. 
              Founded in 1899 as a teacher's college, it is now a comprehensive university offering more than 
              150 undergraduate and graduate majors.
            </p>
            <p>
              Known for its beautiful mountain setting in the Blue Ridge Mountains, "App State" 
              emphasizes sustainability, community engagement, and experiential learning.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Admission Statistics</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Acceptance Rate: 77%</li>
              <li>Average GPA: 3.5</li>
              <li>SAT Range: 1090-1260</li>
              <li>ACT Range: 22-28</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Application Requirements</h2>
            <p className="mb-4">
              Appalachian State University takes a comprehensive approach to admissions, considering 
              academic performance and potential for success.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Online application through Common App or direct application</li>
              <li>Official high school transcript</li>
              <li>Optional: SAT or ACT scores (test-optional policy)</li>
              <li>Application fee or fee waiver</li>
            </ul>
          </section>
        </>
      }
    />
  );
};

export default AppalachianStateUniversity;
