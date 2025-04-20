export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string | null
          id: string
          name: string
          type: Database["public"]["Enums"]["activity_type"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          type: Database["public"]["Enums"]["activity_type"]
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["activity_type"]
        }
        Relationships: []
      }
      booking_options: {
        Row: {
          created_at: string | null
          description: string | null
          duration: string
          id: string
          price: number
          profile_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration: string
          id?: string
          price: number
          profile_id: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: string
          id?: string
          price?: number
          profile_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_options_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_option_id: string
          created_at: string | null
          id: string
          profile_id: string
          scheduled_at: string
          status: Database["public"]["Enums"]["booking_status"] | null
          user_id: string
        }
        Insert: {
          booking_option_id: string
          created_at?: string | null
          id?: string
          profile_id: string
          scheduled_at: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          user_id: string
        }
        Update: {
          booking_option_id?: string
          created_at?: string | null
          id?: string
          profile_id?: string
          scheduled_at?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_booking_option_id_fkey"
            columns: ["booking_option_id"]
            isOneToOne: false
            referencedRelation: "booking_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      majors: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profile_activities: {
        Row: {
          activity_id: string
          created_at: string | null
          id: string
          profile_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string | null
          id?: string
          profile_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string | null
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_activities_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_activities_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          featured: boolean | null
          id: string
          image: string | null
          major_id: string
          name: string
          school_id: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          featured?: boolean | null
          id?: string
          image?: string | null
          major_id: string
          name: string
          school_id: string
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          featured?: boolean | null
          id?: string
          image?: string | null
          major_id?: string
          name?: string
          school_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_major_id_fkey"
            columns: ["major_id"]
            isOneToOne: false
            referencedRelation: "majors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          created_at: string | null
          id: string
          location: string | null
          name: string
          type: Database["public"]["Enums"]["school_type"] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          type?: Database["public"]["Enums"]["school_type"] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          type?: Database["public"]["Enums"]["school_type"] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_type: "club" | "sport" | "study_abroad"
      booking_status: "pending" | "confirmed" | "completed" | "cancelled"
      school_type:
        | "ivy_league"
        | "public"
        | "liberal_arts"
        | "technical"
        | "international"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_type: ["club", "sport", "study_abroad"],
      booking_status: ["pending", "confirmed", "completed", "cancelled"],
      school_type: [
        "ivy_league",
        "public",
        "liberal_arts",
        "technical",
        "international",
      ],
    },
  },
} as const
