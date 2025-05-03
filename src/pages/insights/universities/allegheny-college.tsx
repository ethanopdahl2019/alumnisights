
import React from "react";
import UniversityTemplate from "./UniversityTemplate";

const AlleghenyCollege: React.FC = () => {
  return (
    <UniversityTemplate
      name="Allegheny College"
      content={
        <>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">About Allegheny College</h2>
            <p className="mb-4">
              Allegheny College is a private liberal arts college in Meadville, Pennsylvania. 
              Founded in 1815, it is one of the oldest colleges in the United States and is known 
              for its innovative approach to education through its unique curriculum.
            </p>
            <p>
              The college offers a student-to-faculty ratio of 10:1, allowing for personalized 
              attention and mentorship opportunities. With over 30 majors and numerous 
              interdisciplinary programs, Allegheny encourages students to explore connections 
              between different fields of study.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Admission Statistics</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Acceptance Rate: 64%</li>
              <li>Average GPA: 3.5</li>
              <li>SAT Range: 1150-1350</li>
              <li>ACT Range: 24-30</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Application Requirements</h2>
            <p className="mb-4">
              Allegheny College takes a holistic approach to admissions, considering academic 
              achievement, extracurricular involvement, and personal qualities.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Common Application or Allegheny College Application</li>
              <li>Official high school transcript</li>
              <li>Optional: SAT or ACT scores (test-optional policy)</li>
              <li>Letter of recommendation from a teacher or counselor</li>
              <li>Personal essay</li>
            </ul>
          </section>
        </>
      }
    />
  );
};

export default AlleghenyCollege;
