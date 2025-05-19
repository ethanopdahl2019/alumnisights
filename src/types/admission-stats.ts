
export interface UniversityAdmissionStats {
  university_id: string;
  acceptance_rate: number | null;
  average_sat: number | null;
  average_act: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface UniversityAdmissionStatsResponse {
  data: UniversityAdmissionStats | null;
  error: any;
}
