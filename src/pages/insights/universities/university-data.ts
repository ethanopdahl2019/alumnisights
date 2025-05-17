interface UniversityContent {
  overview?: string;
  admissionStats?: string;
  applicationRequirements?: string;
  alumniInsights?: string;
  chartData?: Array<{ year: number; acceptanceRate: number }>;
}

export interface University {
  id: string;
  name: string;
  title: string;
  content: UniversityContent;
  image?: string;
  didYouKnow?: string;
  chartData?: Array<{ year: number; acceptanceRate: number }>;
}

export const universities: Record<string, University> = {
  "harvard-university": {
    id: "harvard-university",
    name: "Harvard University",
    title: "Harvard University Admissions Guide",
    content: {
      overview: "Harvard University, established in 1636, is one of the most prestigious and oldest institutions of higher learning in the United States. Located in Cambridge, Massachusetts, Harvard consistently ranks among the top universities globally for its academic excellence, distinguished faculty, and groundbreaking research.",
      admissionStats: "Harvard University maintains one of the most competitive admission processes in the world.\n\n• Class of 2024: 4.9% acceptance rate, 1520-1580 average SAT score, 34-36 average ACT score\n• Class of 2025: 3.4% acceptance rate, 1510-1570 average SAT score, 33-35 average ACT score\n• Class of 2026: 3.2% acceptance rate, 1510-1580 average SAT score, 34-36 average ACT score",
      applicationRequirements: "Harvard's application requires:\n\n1. Common Application or Coalition Application\n2. Harvard College Questions for the Common Application\n3. $75 fee or fee waiver\n4. SAT or ACT scores (optional for 2022-2026 admissions cycles)\n5. Two teacher recommendations\n6. School report and counselor recommendation\n7. Mid-year school report\n8. Final school report\n\nEarly Action deadline: November 1\nRegular Decision deadline: January 1"
    },
    image: "/lovable-uploads/bdaaf67c-3436-4d56-bf80-25d5b4978254.png",
    didYouKnow: "Did you know that Harvard's library system is the oldest in the United States and the largest academic library in the world, with over 20 million volumes?",
    chartData: [
      { year: 2022, acceptanceRate: 4.9 },
      { year: 2023, acceptanceRate: 3.4 },
      { year: 2024, acceptanceRate: 3.2 }
    ]
  },
  "stanford-university": {
    id: "stanford-university",
    name: "Stanford University",
    title: "Stanford University Admissions Guide",
    content: {
      overview: "Stanford University, officially Leland Stanford Junior University, is a private research university in Stanford, California. Known for its academic strength, proximity to Silicon Valley, and entrepreneurial spirit, Stanford is a highly selective institution.",
      admissionStats: "Stanford University is renowned for its rigorous admission standards.\n\n• Class of 2024: 3.9% acceptance rate, 1470-1570 average SAT score, 32-35 average ACT score\n• Class of 2025: 3.6% acceptance rate, 1460-1570 average SAT score, 32-35 average ACT score\n• Class of 2026: 3.7% acceptance rate, 1480-1570 average SAT score, 33-35 average ACT score",
      applicationRequirements: "Stanford's application includes:\n\n1. Common Application or Coalition Application\n2. Stanford-specific essays\n3. $90 application fee or fee waiver\n4. SAT or ACT scores (optional for 2020-2021 admissions cycles)\n5. Two letters of recommendation from teachers\n6. Official high school transcript\n\nEarly Action deadline: November 1\nRegular Decision deadline: January 2"
    },
    image: "/lovable-uploads/014a999c-8c9a-4181-b759-2685e447d4e5.png",
    didYouKnow: "Did you know that Stanford was founded in 1885 by Leland and Jane Stanford in memory of their only child, Leland Stanford Jr., who died of typhoid fever at age 15?",
    chartData: [
      { year: 2022, acceptanceRate: 3.9 },
      { year: 2023, acceptanceRate: 3.6 },
      { year: 2024, acceptanceRate: 3.7 }
    ]
  },
  "mit": {
    id: "mit",
    name: "Massachusetts Institute of Technology",
    title: "MIT Admissions Guide",
    content: {
      overview: "The Massachusetts Institute of Technology (MIT) is a private research university in Cambridge, Massachusetts. MIT is dedicated to advancing knowledge and educating students in science, technology, and other areas of scholarship that will best serve the nation and the world.",
      admissionStats: "MIT is known for its selective admission process.\n\n• Class of 2024: 4.0% acceptance rate, 1530-1570 average SAT score, 34-36 average ACT score\n• Class of 2025: 3.96% acceptance rate, 1500-1570 average SAT score, 35-36 average ACT score\n• Class of 2026: 4.8% acceptance rate, 1510-1580 average SAT score, 35-36 average ACT score",
      applicationRequirements: "MIT's application requires:\n\n1. MIT application\n2. Essays\n3. High school transcripts\n4. SAT or ACT scores\n5. Two letters of recommendation from teachers\n6. One letter of recommendation from a counselor\n\nEarly Action deadline: November 15\nRegular Action deadline: January 1"
    },
    image: "/lovable-uploads/56a95494-9989-407a-9969-ca25a9a094ff.png",
    didYouKnow: "Did you know that MIT has a 'hacks' tradition, where students pull elaborate pranks, often involving technology and engineering, showcasing their creativity and skills?",
    chartData: [
      { year: 2022, acceptanceRate: 4.0 },
      { year: 2023, acceptanceRate: 3.96 },
      { year: 2024, acceptanceRate: 4.8 }
    ]
  },
};
