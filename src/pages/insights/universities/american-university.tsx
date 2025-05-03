
import React from "react";
import UniversityTemplate from "./UniversityTemplate";

const AmericanUniversity: React.FC = () => {
  return (
    <UniversityTemplate
      name="American University"
      content={
        <>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">About American University</h2>
            <p className="mb-4">
              American University is a private research university in Washington, D.C. Founded in 1893, 
              it is known for its programs in international service, public policy, and international law.
            </p>
            <p>
              Located in the nation's capital, American University offers students unparalleled opportunities 
              for internships, research, and networking with government agencies, international organizations, 
              and nonprofits.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Admission Statistics</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Acceptance Rate: 36%</li>
              <li>Average GPA: 3.65</li>
              <li>SAT Range: 1220-1390</li>
              <li>ACT Range: 27-31</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Application Requirements</h2>
            <p className="mb-4">
              American University's admissions process is selective and considers academic achievement, 
              extracurricular activities, and demonstrated interest in global affairs.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Common Application or Coalition Application</li>
              <li>Official high school transcript</li>
              <li>Optional: SAT or ACT scores (test-optional policy)</li>
              <li>Two letters of recommendation</li>
              <li>Personal essay</li>
              <li>Application fee or fee waiver</li>
            </ul>
          </section>
        </>
      }
    />
  );
};

export default AmericanUniversity;
