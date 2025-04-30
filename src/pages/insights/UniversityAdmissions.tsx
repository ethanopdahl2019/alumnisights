
import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface University {
  id: string;
  name: string;
  title: string;
  content: string[];
}

const universities: Record<string, University> = {
  stanford: {
    id: "stanford",
    name: "Stanford University",
    title: "How to Get into Stanford University",
    content: [
      "Founded in 1885 by Leland and Jane Stanford in memory of their only child, Stanford University is a private research university located in Stanford, California, in the heart of Silicon Valley. Widely regarded as one of the most prestigious institutions in the world, Stanford has played a central role in advancing education, entrepreneurship, science, technology, and public leadership across the modern era. Its motto, “Die Luft der Freiheit weht” (“The wind of freedom blows”), reflects the university’s spirit of intellectual independence and innovation.
"Stanford’s seven schools — Humanities and Sciences, Engineering, Earth Sciences, Education, Business, Law, and Medicine — offer students unparalleled academic opportunities. The university’s undergraduate program emphasizes interdisciplinary learning, research experience, and the freedom to explore intellectual passions across fields. Stanford students can choose from over 65 major fields, and many pursue interdisciplinary programs, dual majors, or individually designed courses of study.
Stanford’s undergraduate acceptance rate stands around 3.9%, making it one of the most selective universities globally. Admitted students typically score between 1500 and 1580 on the SAT or between 33 and 35 on the ACT. However, academic excellence is only part of the equation: Stanford places great emphasis on intellectual vitality, innovation, leadership, resilience, and a demonstrated drive to make a positive impact on the world. Essays, letters of recommendation, extracurricular involvement, and personal qualities carry substantial weight in the admissions process.
The university’s proximity to Silicon Valley creates unmatched opportunities for students interested in technology, entrepreneurship, venture capital, and innovation. Stanford alumni have founded companies like Google, Netflix, Hewlett-Packard, Instagram, LinkedIn, and Yahoo!, making it arguably the most influential university in global startup culture. Resources like the Stanford Technology Ventures Program (STVP), the d.school (Hasso Plattner Institute of Design), and StartX accelerator foster student entrepreneurship from day one.
Stanford is classified as an R1 research university with more than 20 independent research centers, including SLAC National Accelerator Laboratory, Hoover Institution on War, Revolution, and Peace, and the Stanford Institute for Human-Centered Artificial Intelligence (HAI). Undergraduates frequently engage in original research through the Stanford Undergraduate Research Institute (SURI) and the Vice Provost’s Office for Undergraduate Education (VPUE) programs.
Did You Know? Stanford University holds the distinction of producing the second-highest number of billionaires among its alumni (after Harvard), and its alumni-founded companies collectively generate trillions of dollars annually.
Campus Life:
Stanford’s sprawling 8,180-acre campus — one of the largest in the United States — blends iconic architecture (like the Stanford Memorial Church and Hoover Tower) with cutting-edge research facilities, art museums, sculpture gardens, and lush natural landscapes. Students live primarily on campus across residential neighborhoods organized around themes and communities that foster close relationships and intellectual engagement.
Student life is exceptionally dynamic, with more than 650 student organizations ranging from entrepreneurial clubs to artistic ensembles, social justice organizations, environmental activism groups, and athletic teams. The ASSU (Associated Students of Stanford University) provides governance and funding for a wide array of initiatives.
Stanford’s athletic tradition is also formidable. Competing in NCAA Division I as part of the Pac-12 Conference, Stanford has won more NCAA championships than any other university. Cardinal athletes have consistently represented the United States in the Olympics, bringing home hundreds of medals.
Culture and Traditions:
Stanford balances intense academic culture with traditions that celebrate creativity and community. Key events include Full Moon on the Quad, Admit Weekend, the Fountain Hopping tradition (where students hop between campus fountains during warm nights), and the Big Game against UC Berkeley — culminating in the legendary "Stanford Axe" rivalry trophy.
The university encourages not only academic and professional excellence but also public service. The Haas Center for Public Service offers fellowships, programs, and community partnerships to integrate service with students’ academic and career paths. Global citizenship is central to the Stanford experience, with many students participating in service-learning abroad, policy fellowships, and international research projects.
Final Perspective:
Stanford is often called a "place where tomorrow is made" — and for good reason. Its students, faculty, and alumni have reshaped entire industries, advanced the frontiers of knowledge, and set new standards for leadership and service. What defines Stanford above all is its culture of ambition combined with a spirit of collaboration — a belief that true excellence emerges not from competition alone, but from a shared commitment to building a better future. As former Stanford President John Hennessy said, "We educate students to think big, think deep, and think forward." Stanford remains one of the most vibrant, influential, and forward-thinking institutions in the world today.
  ]
  },
  harvard: {
    id: "harvard",
    name: "Harvard University",
    title: "How to Get into Harvard University",
    content: [
      "Harvard University, established in 1636, is the oldest institution of higher education in the United States and a member of the prestigious Ivy League. Located in Cambridge, Massachusetts, Harvard has educated numerous influential individuals including eight U.S. presidents, business leaders, Nobel laureates, and countless innovators across disciplines.",
      "The university offers an exceptional educational experience through its renowned faculty, extensive resources, and diverse student community. Harvard College, the undergraduate division, follows a liberal arts and sciences philosophy that encourages intellectual exploration across disciplines.",
      "Harvard's admissions process is highly selective with an acceptance rate typically around 3-5%. While academic excellence is essential, with successful applicants generally scoring in the top percentiles on standardized tests, Harvard values a holistic approach that considers personal qualities, extracurricular achievements, community involvement, and potential for leadership and growth. Essays and recommendations provide crucial insight into applicants' character, motivations, and unique perspectives."
    ]
  },
  yale: {
    id: "yale",
    name: "Yale University",
    title: "How to Get into Yale University",
    content: [
      "Yale University, founded in 1701, is one of America's most historic and prestigious institutions of higher learning. Located in New Haven, Connecticut, Yale combines centuries of tradition with cutting-edge research and education. Its distinctive residential college system creates tight-knit communities within the larger university, fostering close relationships between students and faculty.",
      "Yale College offers a liberal arts curriculum that encourages students to think critically across disciplines before specializing in one of over 80 possible majors. The university is particularly renowned for its programs in law, drama, music, architecture, and management, alongside strong offerings in sciences and humanities.",
      "Yale's admissions process is highly competitive, with an acceptance rate typically around 5-6%. While academic excellence is expected, with most admitted students ranking at the top of their high school classes, Yale emphasizes a holistic review process that values intellectual curiosity, leadership potential, and diverse perspectives. The university seeks students who will contribute to campus life and make an impact after graduation through their chosen fields."
    ]
  },
  mit: {
    id: "mit",
    name: "MIT",
    title: "How to Get into MIT",
    content: [
      "The Massachusetts Institute of Technology (MIT), established in 1861, is a world-renowned institution dedicated to advancing knowledge and educating students in science, technology, and other fields of study. Located in Cambridge, Massachusetts, MIT has been at the forefront of scientific breakthroughs and technological innovations that have shaped our modern world.",
      "MIT's educational approach emphasizes hands-on problem solving, interdisciplinary collaboration, and the pursuit of rigorous analytical thinking. Students engage with cutting-edge research from the beginning of their undergraduate careers, often working alongside faculty who are leaders in their fields.",
      "MIT's admissions process is extremely selective, with an acceptance rate typically around 4%. While strong academic preparation in mathematics and science is essential, MIT looks for students who demonstrate creativity, collaborative spirit, and a passion for making a positive impact through technology and science. Applicants should showcase their innovative thinking, hands-on projects, and genuine intellectual curiosity throughout their application."
    ]
  },
  princeton: {
    id: "princeton",
    name: "Princeton University",
    title: "How to Get into Princeton University",
    content: [
      "Princeton University, founded in 1746, is one of the oldest and most respected research universities in the United States. Located in Princeton, New Jersey, the university combines the strengths of a major research institution with the qualities of an outstanding liberal arts college.",
      "Princeton's distinctive educational model emphasizes undergraduate teaching while offering students access to world-class research opportunities. The university is known for its commitment to teaching, with faculty members who are both distinguished scholars and dedicated educators. Princeton's residential college system helps create a supportive community atmosphere within the larger university environment.",
      "Princeton's admissions process is highly selective, with an acceptance rate typically around 4-6%. While academic excellence is expected, Princeton values students who demonstrate intellectual curiosity, leadership potential, and a commitment to service. The university seeks to admit a diverse group of students who will contribute different perspectives and talents to campus life."
    ]
  },
  columbia: {
    id: "columbia",
    name: "Columbia University",
    title: "How to Get into Columbia University",
    content: [
      "Columbia University, founded in 1754 as King's College, is one of the world's most important centers of research and learning. Located in New York City's Manhattan borough, Columbia offers students the unique advantage of studying in a global city filled with cultural, professional, and educational opportunities.",
      "Columbia College, the university's undergraduate liberal arts college, is known for its Core Curriculum, which provides all students with a shared intellectual experience exploring literature, philosophy, science, art, music, and history. Beyond the Core, students can choose from over 80 areas of study.",
      "Columbia's admissions process is highly competitive, with an acceptance rate typically around 3-6%. The university seeks academically exceptional students who will thrive in its rigorous intellectual environment while contributing to its diverse community. Columbia values students who demonstrate intellectual curiosity, leadership abilities, and a desire to engage with complex global challenges."
    ]
  },
  upenn: {
    id: "upenn",
    name: "University of Pennsylvania",
    title: "How to Get into University of Pennsylvania",
    content: [
      "The University of Pennsylvania, founded by Benjamin Franklin in 1740, is a private Ivy League research university located in Philadelphia. Penn has a long tradition of intellectual rigor and a pioneering spirit that continues to this day through its integration of arts and sciences with professions like business, engineering, medicine, and nursing.",
      "Penn's undergraduate schools—the College of Arts and Sciences, the School of Engineering and Applied Science, the Wharton School, and the School of Nursing—offer students exceptional opportunities to pursue their interests across disciplines. The university is known for its interdisciplinary approach, allowing students to take courses across its various schools.",
      "Penn's admissions process is highly selective, with an acceptance rate typically around 5-8%. While academic excellence is important, Penn values students who show intellectual curiosity, leadership potential, and a drive to make a positive impact. The university looks for applicants who will contribute to its dynamic community while taking advantage of the resources available at a research institution located in a major urban center."
    ]
  },
  dartmouth: {
    id: "dartmouth",
    name: "Dartmouth College",
    title: "How to Get into Dartmouth College",
    content: [
      "Dartmouth College, founded in 1769, is a private Ivy League research university located in Hanover, New Hampshire. Known for its focus on undergraduate education within a research university setting, Dartmouth combines the intimacy of a college with the resources of a larger institution.",
      "Dartmouth operates on a quarter system that includes a flexible plan called the 'D-Plan,' which allows students to customize their academic calendar. This system facilitates opportunities for internships, research, and international experiences throughout the year. The college is known for its strong programs in the liberal arts, sciences, engineering, and business.",
      "Dartmouth's admissions process is highly selective, with an acceptance rate typically around 6-9%. The college seeks academically accomplished students who will contribute to campus life through their unique perspectives, talents, and interests. Dartmouth values applicants who demonstrate intellectual curiosity, character, and a willingness to engage with different viewpoints and challenges."
    ]
  },
  brown: {
    id: "brown",
    name: "Brown University",
    title: "How to Get into Brown University",
    content: [
      "Brown University, founded in 1764, is a private Ivy League research university located in Providence, Rhode Island. Known for its innovative approach to education, Brown offers an open curriculum that allows students to design their own course of study based on their interests and goals.",
      "Brown's educational philosophy emphasizes student choice and responsibility. There are no core requirements outside the student's chosen concentration, giving undergraduates unprecedented freedom to shape their education. This approach attracts students who are intellectually curious, self-motivated, and eager to take ownership of their learning.",
      "Brown's admissions process is highly selective, with an acceptance rate typically around 5-8%. While academic excellence is important, Brown seeks students who demonstrate intellectual curiosity, creativity, and a willingness to take academic risks. The university values applicants who have pursued their passions deeply and who will bring diverse perspectives and experiences to campus."
    ]
  },
  cornell: {
    id: "cornell",
    name: "Cornell University",
    title: "How to Get into Cornell University",
    content: [
      "Cornell University, founded in 1865, is a private Ivy League and land-grant research university located in Ithaca, New York. Cornell's founder, Ezra Cornell, established the institution with the vision of creating a place where 'any person can find instruction in any study,' a principle that continues to guide the university today.",
      "Cornell is organized into seven undergraduate colleges and schools, each with its own admissions requirements and academic focus. This structure gives students the benefits of attending both a large, diverse university and a smaller college centered around their specific interests. The university offers over 4,000 courses across 100 academic departments.",
      "Cornell's admissions process varies by college within the university, with overall acceptance rates typically around 8-10%. While academic preparation relevant to the intended field of study is essential, Cornell also values students who demonstrate intellectual potential, leadership abilities, and a commitment to making a meaningful contribution to their communities and chosen fields."
    ]
  },
};

const UniversityAdmissions = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const university = id ? universities[id] : null;

  if (!university) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-xl">University not found</p>
        <Button 
          onClick={() => navigate("/insights/undergraduate-admissions")}
          className="mt-4"
          variant="outline"
        >
          Back to Universities
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{university.title} | AlumniSights</title>
        <meta name="description" content={`Learn how to get admitted to ${university.name}`} />
      </Helmet>
      
      <Navbar />
      
      <main className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Button 
              onClick={() => navigate("/insights/undergraduate-admissions")}
              variant="ghost" 
              className="mb-4 pl-0 hover:bg-transparent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Universities
            </Button>
            
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-6">
              {university.title}
            </h1>
            <div className="w-20 h-1 bg-blue-600 rounded-full mb-8"></div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            {university.content.map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UniversityAdmissions;
