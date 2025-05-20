
export interface OnboardingStepProps {
  onNext: (data?: any) => void;
  onBack?: () => void;
  initialData?: any;
}

export type OnboardingStep = {
  id: string;
  title: string;
  description?: string;
}

export interface School {
  id: string;
  name: string;
  location?: string;
  type?: string;
}

export interface Major {
  id: string;
  name: string;
  category?: string;
}

export interface Sport {
  id: string;
  name: string;
}

export interface Club {
  id: string;
  name: string;
}

export interface GreekLife {
  id: string;
  name: string;
  type: string;
}

export type DegreeType = 'ba' | 'bs' | 'ma' | 'ms' | 'mba' | 'phd' | 'md' | 'jd' | 'other';

export interface PricingInfo {
  price_15_min: number | null;
  price_30_min: number | null;
  price_60_min: number | null;
}

export interface OnboardingData {
  schoolId?: string;
  majorId?: string;
  degree?: DegreeType;
  sports?: string[];
  clubs?: string[];
  greekLife?: string[];
  bio?: string;
  pricing?: PricingInfo;
  image?: string | null;
}
