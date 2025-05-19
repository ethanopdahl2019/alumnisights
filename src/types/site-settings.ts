
import { Database } from '@/integrations/supabase/types';

export interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type SiteSettingsResponse = Database['public']['Tables']['site_settings']['Row'];
