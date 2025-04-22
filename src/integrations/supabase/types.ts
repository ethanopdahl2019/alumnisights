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
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_post_categories: {
        Row: {
          category_id: string
          created_at: string
          id: string
          post_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          post_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured: boolean
          featured_image: string | null
          id: string
          published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          featured_image?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          featured_image?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
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
      content_blocks: {
        Row: {
          content: string
          created_at: string
          id: string
          major_id: string | null
          order_position: number
          school_id: string | null
          title: string
          type: Database["public"]["Enums"]["content_block_type"]
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          major_id?: string | null
          order_position: number
          school_id?: string | null
          title: string
          type: Database["public"]["Enums"]["content_block_type"]
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          major_id?: string | null
          order_position?: number
          school_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["content_block_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_blocks_major_id_fkey"
            columns: ["major_id"]
            isOneToOne: false
            referencedRelation: "majors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_blocks_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          alumni_id: string
          applicant_id: string
          created_at: string | null
          id: string
          payment_status: string | null
          product_type: string
          updated_at: string | null
        }
        Insert: {
          alumni_id: string
          applicant_id: string
          created_at?: string | null
          id?: string
          payment_status?: string | null
          product_type: string
          updated_at?: string | null
        }
        Update: {
          alumni_id?: string
          applicant_id?: string
          created_at?: string | null
          id?: string
          payment_status?: string | null
          product_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      landing_page_blocks: {
        Row: {
          content_block_id: string
          created_at: string
          id: string
          landing_page_id: string
        }
        Insert: {
          content_block_id: string
          created_at?: string
          id?: string
          landing_page_id: string
        }
        Update: {
          content_block_id?: string
          created_at?: string
          id?: string
          landing_page_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "landing_page_blocks_content_block_id_fkey"
            columns: ["content_block_id"]
            isOneToOne: false
            referencedRelation: "content_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "landing_page_blocks_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_page_templates: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      landing_pages: {
        Row: {
          created_at: string
          id: string
          major_id: string | null
          meta_description: string | null
          meta_title: string | null
          school_id: string | null
          slug: string
          template_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          major_id?: string | null
          meta_description?: string | null
          meta_title?: string | null
          school_id?: string | null
          slug: string
          template_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          major_id?: string | null
          meta_description?: string | null
          meta_title?: string | null
          school_id?: string | null
          slug?: string
          template_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "landing_pages_major_id_fkey"
            columns: ["major_id"]
            isOneToOne: false
            referencedRelation: "majors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "landing_pages_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "landing_pages_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "landing_page_templates"
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
      messages: {
        Row: {
          attachment_url: string | null
          content: string
          created_at: string | null
          id: string
          read: boolean | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          attachment_url?: string | null
          content: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          attachment_url?: string | null
          content?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          recipient_id?: string
          sender_id?: string
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
          price_15_min: number | null
          price_30_min: number | null
          price_60_min: number | null
          role: string | null
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
          price_15_min?: number | null
          price_30_min?: number | null
          price_60_min?: number | null
          role?: string | null
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
          price_15_min?: number | null
          price_30_min?: number | null
          price_60_min?: number | null
          role?: string | null
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
      school_activity_paragraphs: {
        Row: {
          activity_id: string | null
          created_at: string | null
          id: string
          paragraph: string
          school_id: string | null
        }
        Insert: {
          activity_id?: string | null
          created_at?: string | null
          id?: string
          paragraph: string
          school_id?: string | null
        }
        Update: {
          activity_id?: string | null
          created_at?: string | null
          id?: string
          paragraph?: string
          school_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_activity_paragraphs_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_activity_paragraphs_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      school_major_paragraphs: {
        Row: {
          created_at: string | null
          id: string
          major_id: string | null
          paragraph: string
          school_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          major_id?: string | null
          paragraph: string
          school_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          major_id?: string | null
          paragraph?: string
          school_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_major_paragraphs_major_id_fkey"
            columns: ["major_id"]
            isOneToOne: false
            referencedRelation: "majors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_major_paragraphs_school_id_fkey"
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
          image: string | null
          location: string | null
          name: string
          type: Database["public"]["Enums"]["school_type"] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image?: string | null
          location?: string | null
          name: string
          type?: Database["public"]["Enums"]["school_type"] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image?: string | null
          location?: string | null
          name?: string
          type?: Database["public"]["Enums"]["school_type"] | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          type: Database["public"]["Enums"]["tag_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          type: Database["public"]["Enums"]["tag_type"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["tag_type"]
        }
        Relationships: []
      }
      user_tags: {
        Row: {
          created_at: string
          id: string
          tag_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tag_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tag_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
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
      content_block_type: "school" | "major" | "general"
      school_type:
        | "ivy_league"
        | "public"
        | "liberal_arts"
        | "technical"
        | "international"
      tag_type:
        | "major"
        | "sport"
        | "club"
        | "study"
        | "study_abroad"
        | "interest"
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
      content_block_type: ["school", "major", "general"],
      school_type: [
        "ivy_league",
        "public",
        "liberal_arts",
        "technical",
        "international",
      ],
      tag_type: ["major", "sport", "club", "study", "study_abroad", "interest"],
    },
  },
} as const
