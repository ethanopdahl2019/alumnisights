
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
