export interface School {
  id: string;
  name: string;
  location: string | null;
  type: 'ivy_league' | 'public' | 'liberal_arts' | 'technical' | 'international' | null;
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
}

export interface ProfileWithDetails extends Profile {
  school: School;
  major: Major;
  activities: Activity[];
}

// New types for authentication
export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  firstName: string;
  lastName: string;
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
  template?: LandingPageTemplate;
  school?: School;
  major?: Major;
  content_blocks?: ContentBlock[];
}
