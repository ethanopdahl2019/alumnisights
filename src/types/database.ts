export interface School {
  id: string;
  name: string;
  location: string | null;
  type: 'ivy_league' | 'public' | 'liberal_arts' | 'technical' | 'international' | null;
  image: string | null;
  description?: string | null;
  founded_year?: number | null;
  student_population?: number | null;
  acceptance_rate?: number | null;
  website_url?: string | null;
  campus_size?: string | null;
  ranking?: number | null;
  tuition_in_state?: number | null;
  tuition_out_state?: number | null;
  notable_alumni?: string[] | null;
}

export interface Major {
  id: string;
  name: string;
  category: string | null;
}

export interface Activity {
  id: string;
  name: string;
  type: 'club' | 'sport' | 'study_abroad';
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  image: string | null;
  school_id: string;
  major_id: string;
  bio: string | null;
  featured: boolean;
  created_at: string;
  price_15_min?: number | null;
  price_30_min?: number | null;
  price_60_min?: number | null;
  role?: 'applicant' | 'alumni';
  headline?: string | null;
  graduation_year?: number | null;
  location?: string | null;
  social_links?: Record<string, any> | string | null;
  achievements?: string[] | null;
  school_name?: string | null;
  major_name?: string | null;
  degree?: string | null;  // Changed to accept any string
  visible?: boolean | null; // Added visible field to control Browse visibility
}

export interface ProfileWithDetails extends Profile {
  school: School;
  major: Major;
  activities: Activity[];
  price_15_min?: number | null;
  price_30_min?: number | null;
  price_60_min?: number | null;
  role?: 'applicant' | 'alumni';
  headline?: string | null;
  graduation_year?: number | null;
  location?: string | null;
  social_links?: Record<string, any> | string | null;
  achievements?: string[] | null;
  greek_life?: {
    id: string;
    name: string;
    type: string;
  } | null;
  school_name?: string | null;
  major_name?: string | null;
  degree?: string | null;  // Changed to accept any string
}

// New types for authentication
export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  firstName: string;
  lastName: string;
  metadata?: Record<string, any>;
}

export interface Company {
  id: string;
  profile_id: string;
  name: string;
  position: string;
  start_date: string | null;
  end_date: string | null;
  current: boolean;
  created_at: string;
}

export interface ProfileSchool {
  id: string;
  profile_id: string;
  school_id: string;
  graduation_year: number | null;
  degree: string | null;
  created_at: string;
  school?: School;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author_id: string | null;
  published: boolean;
  featured: boolean;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author?: {
    name: string;
    image: string | null;
  };
  categories?: BlogCategory[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface LandingPageTemplate {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface ContentBlock {
  id: string;
  type: 'school' | 'major' | 'general';
  title: string;
  content: string;
  school_id: string | null;
  major_id: string | null;
  order_position: number;
  created_at: string;
  updated_at: string;
}

export interface LandingPage {
  id: string;
  template_id: string;
  slug: string;
  title: string;
  school_id: string | null;
  major_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  template?: LandingPageTemplate | null;
  school?: School | null;
  major?: Major | null;
  content_blocks?: ContentBlock[];
}

// Add new interface for UniversityContent
export interface UniversityContent {
  id: string;
  name: string;
  overview: string;
  admission_stats: string;
  application_requirements: string;
  alumni_insights?: string | null;
  image?: string | null;
  logo?: string | null;
  did_you_know?: string | null;
  created_at: string;
  updated_at: string;
}
