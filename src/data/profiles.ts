
import { TagData } from '@/components/ProfileCard';

export interface Profile {
  id: string;
  name: string;
  image: string;
  school: string;
  major: string;
  bio: string;
  tags: TagData[];
  bookingOptions: BookingOption[];
}

export interface BookingOption {
  id: string;
  title: string;
  duration: string;
  description: string;
  price: number;
}

const profiles: Profile[] = [
  {
    id: '1',
    name: 'Emma J.',
    image: '/lovable-uploads/19830d85-2491-421d-a0f2-33a9daa885ee.png',
    school: 'Harvard University',
    major: 'Economics',
    bio: 'Current Harvard economics major with a minor in Statistics. Previously interned at Goldman Sachs and involved with the Harvard Investment Association. Happy to share insights about academics, recruiting, and campus life!',
    tags: [
      { id: '1', label: 'Economics', type: 'major' },
      { id: '2', label: 'Investment Club', type: 'club' },
      { id: '3', label: 'Study Abroad - London', type: 'study' },
      { id: '4', label: 'Goldman Sachs Intern', type: 'club' }
    ],
    bookingOptions: [
      {
        id: 'option1',
        title: 'Coffee Chat',
        duration: '15 min',
        description: 'Quick conversation to answer a few specific questions about my experience.',
        price: 25
      },
      {
        id: 'option2',
        title: 'Q&A Session',
        duration: '30 min',
        description: 'Detailed discussion covering academics, extracurriculars, and campus life.',
        price: 45
      },
      {
        id: 'option3',
        title: 'In-depth Discussion',
        duration: '1 hour',
        description: 'Comprehensive consultation on application strategy, career paths, and personal insights.',
        price: 80
      }
    ]
  },
  {
    id: '2',
    name: 'Marcus L.',
    image: '/lovable-uploads/bf7a0b91-36d2-46d4-8803-819e968daf23.png',
    school: 'Stanford University',
    major: 'Computer Science',
    bio: 'Stanford CS senior focusing on AI/ML. Currently doing research with the Stanford NLP Group and previously interned at Google. Can provide insights about tech recruiting, research opportunities, and navigating Stanford\'s CS program.',
    tags: [
      { id: '5', label: 'Computer Science', type: 'major' },
      { id: '6', label: 'AI Research', type: 'club' },
      { id: '7', label: 'Hackathon Winner', type: 'club' },
      { id: '8', label: 'Google Intern', type: 'club' }
    ],
    bookingOptions: [
      {
        id: 'option1',
        title: 'Coffee Chat',
        duration: '15 min',
        description: 'Quick conversation to answer a few specific questions about my experience.',
        price: 25
      },
      {
        id: 'option2',
        title: 'Q&A Session',
        duration: '30 min',
        description: 'Detailed discussion covering academics, extracurriculars, and campus life.',
        price: 45
      },
      {
        id: 'option3',
        title: 'In-depth Discussion',
        duration: '1 hour',
        description: 'Comprehensive consultation on application strategy, career paths, and personal insights.',
        price: 80
      }
    ]
  },
  {
    id: '3',
    name: 'Sophia K.',
    image: '/lovable-uploads/3e5832a7-0f92-485d-b843-fc9a51c39a51.png',
    school: 'Yale University',
    major: 'Political Science',
    bio: 'Yale senior studying Political Science with a focus on international relations. Captain of the debate team and editor for the Yale Political Union publication. Can discuss the humanities pathway, campus politics, and residential college life.',
    tags: [
      { id: '9', label: 'Political Science', type: 'major' },
      { id: '10', label: 'Debate Team', type: 'club' },
      { id: '11', label: 'Study Abroad - Paris', type: 'study' },
      { id: '12', label: 'Peer Mentor', type: 'club' }
    ],
    bookingOptions: [
      {
        id: 'option1',
        title: 'Coffee Chat',
        duration: '15 min',
        description: 'Quick conversation to answer a few specific questions about my experience.',
        price: 25
      },
      {
        id: 'option2',
        title: 'Q&A Session',
        duration: '30 min',
        description: 'Detailed discussion covering academics, extracurriculars, and campus life.',
        price: 45
      },
      {
        id: 'option3',
        title: 'In-depth Discussion',
        duration: '1 hour',
        description: 'Comprehensive consultation on application strategy, career paths, and personal insights.',
        price: 80
      }
    ]
  },
  {
    id: '4',
    name: 'Tyler R.',
    image: '/lovable-uploads/7fec42df-cb85-49b6-83e8-b0ae6b67e840.png',
    school: 'University of Alabama',
    major: 'Business Administration',
    bio: 'Business Administration major and member of Alpha Phi Alpha fraternity at Alabama. Involved in student government and the university\'s entrepreneurship program. Happy to talk about Greek life, southern campus culture, and pursuing business in a state school.',
    tags: [
      { id: '13', label: 'Business Administration', type: 'major' },
      { id: '14', label: 'Alpha Phi Alpha', type: 'club' },
      { id: '15', label: 'Football', type: 'sport' },
      { id: '16', label: 'Student Government', type: 'club' }
    ],
    bookingOptions: [
      {
        id: 'option1',
        title: 'Coffee Chat',
        duration: '15 min',
        description: 'Quick conversation to answer a few specific questions about my experience.',
        price: 25
      },
      {
        id: 'option2',
        title: 'Q&A Session',
        duration: '30 min',
        description: 'Detailed discussion covering academics, extracurriculars, and campus life.',
        price: 45
      },
      {
        id: 'option3',
        title: 'In-depth Discussion',
        duration: '1 hour',
        description: 'Comprehensive consultation on application strategy, career paths, and personal insights.',
        price: 80
      }
    ]
  },
  {
    id: '5',
    name: 'Jasmine P.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    school: 'Amherst College',
    major: 'Environmental Science',
    bio: 'Environmental Science major and lacrosse player at Amherst. Research assistant in climate change studies and sustainability council member. Can share insights about NESCAC schools, balancing athletics with academics, and environmental programs.',
    tags: [
      { id: '17', label: 'Environmental Science', type: 'major' },
      { id: '18', label: 'Lacrosse', type: 'sport' },
      { id: '19', label: 'Sustainability Council', type: 'club' },
      { id: '20', label: 'Study Abroad - Costa Rica', type: 'study' }
    ],
    bookingOptions: [
      {
        id: 'option1',
        title: 'Coffee Chat',
        duration: '15 min',
        description: 'Quick conversation to answer a few specific questions about my experience.',
        price: 25
      },
      {
        id: 'option2',
        title: 'Q&A Session',
        duration: '30 min',
        description: 'Detailed discussion covering academics, extracurriculars, and campus life.',
        price: 45
      },
      {
        id: 'option3',
        title: 'In-depth Discussion',
        duration: '1 hour',
        description: 'Comprehensive consultation on application strategy, career paths, and personal insights.',
        price: 80
      }
    ]
  },
  {
    id: '6',
    name: 'Daniel W.',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    school: 'Duke University',
    major: 'Neuroscience',
    bio: 'Duke Neuroscience major on the pre-med track. Researcher in the cognitive neuroscience lab and volunteer at Duke University Hospital. Can discuss pre-health at Duke, research opportunities, and the balance between social and academic life.',
    tags: [
      { id: '21', label: 'Neuroscience', type: 'major' },
      { id: '22', label: 'Pre-Med', type: 'major' },
      { id: '23', label: 'Basketball', type: 'sport' },
      { id: '24', label: 'Hospital Volunteer', type: 'club' }
    ],
    bookingOptions: [
      {
        id: 'option1',
        title: 'Coffee Chat',
        duration: '15 min',
        description: 'Quick conversation to answer a few specific questions about my experience.',
        price: 25
      },
      {
        id: 'option2',
        title: 'Q&A Session',
        duration: '30 min',
        description: 'Detailed discussion covering academics, extracurriculars, and campus life.',
        price: 45
      },
      {
        id: 'option3',
        title: 'In-depth Discussion',
        duration: '1 hour',
        description: 'Comprehensive consultation on application strategy, career paths, and personal insights.',
        price: 80
      }
    ]
  }
];

export default profiles;
