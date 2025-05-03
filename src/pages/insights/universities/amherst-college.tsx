
import React from "react";
import UniversityTemplate from "./UniversityTemplate";

const AmherstCollege: React.FC = () => {
  return (
    <UniversityTemplate
      name="Amherst College"
      content={
        <>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">About Amherst College</h2>
            <p className="mb-4">
              Amherst College is a private liberal arts college located in Amherst, Massachusetts. 
              Founded in 1821, it is widely regarded as one of the premier liberal arts colleges in the United States.
            </p>
            <p>
              With an open curriculum, Amherst allows students to design their own academic path 
              without core requirements outside of their major. The college is known for its small class sizes, 
              with a student-to-faculty ratio of 7:1.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Admission Statistics</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Acceptance Rate: 11%</li>
              <li>Average GPA: 4.0</li>
              <li>SAT Range: 1400-1550</li>
              <li>ACT Range: 31-34</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Application Requirements</h2>
            <p className="mb-4">
              Amherst College's admissions process is highly selective and seeks students who demonstrate 
              intellectual curiosity, academic excellence, and diverse perspectives.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Common Application or Coalition Application</li>
              <li>Official high school transcript</li>
              <li>Optional: SAT or ACT scores (test-optional policy)</li>
              <li>Two teacher recommendations</li>
              <li>School counselor recommendation</li>
              <li>Personal essay and supplemental writing</li>
            </ul>
          </section>
        </>
      }
    />
  );
};

export default AmherstCollege;
