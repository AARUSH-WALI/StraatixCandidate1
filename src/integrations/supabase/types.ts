export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          applied_at: string
          id: string
          job_id: string
          snapshot_address: string | null
          snapshot_class_x_percentage: number | null
          snapshot_class_x_school: string | null
          snapshot_class_x_year: number | null
          snapshot_class_xii_percentage: number | null
          snapshot_class_xii_school: string | null
          snapshot_class_xii_year: number | null
          snapshot_current_company: string | null
          snapshot_current_ctc: number | null
          snapshot_date_of_birth: string | null
          snapshot_degree_cgpa: number | null
          snapshot_degree_institution: string | null
          snapshot_degree_name: string | null
          snapshot_degree_year: number | null
          snapshot_email: string
          snapshot_expected_ctc: number | null
          snapshot_gender: string | null
          snapshot_name: string
          snapshot_nationality: string | null
          snapshot_phone: string | null
          snapshot_resume_url: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_at?: string
          id?: string
          job_id: string
          snapshot_address?: string | null
          snapshot_class_x_percentage?: number | null
          snapshot_class_x_school?: string | null
          snapshot_class_x_year?: number | null
          snapshot_class_xii_percentage?: number | null
          snapshot_class_xii_school?: string | null
          snapshot_class_xii_year?: number | null
          snapshot_current_company?: string | null
          snapshot_current_ctc?: number | null
          snapshot_date_of_birth?: string | null
          snapshot_degree_cgpa?: number | null
          snapshot_degree_institution?: string | null
          snapshot_degree_name?: string | null
          snapshot_degree_year?: number | null
          snapshot_email: string
          snapshot_expected_ctc?: number | null
          snapshot_gender?: string | null
          snapshot_name: string
          snapshot_nationality?: string | null
          snapshot_phone?: string | null
          snapshot_resume_url?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_at?: string
          id?: string
          job_id?: string
          snapshot_address?: string | null
          snapshot_class_x_percentage?: number | null
          snapshot_class_x_school?: string | null
          snapshot_class_x_year?: number | null
          snapshot_class_xii_percentage?: number | null
          snapshot_class_xii_school?: string | null
          snapshot_class_xii_year?: number | null
          snapshot_current_company?: string | null
          snapshot_current_ctc?: number | null
          snapshot_date_of_birth?: string | null
          snapshot_degree_cgpa?: number | null
          snapshot_degree_institution?: string | null
          snapshot_degree_name?: string | null
          snapshot_degree_year?: number | null
          snapshot_email?: string
          snapshot_expected_ctc?: number | null
          snapshot_gender?: string | null
          snapshot_name?: string
          snapshot_nationality?: string | null
          snapshot_phone?: string | null
          snapshot_resume_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_profiles: {
        Row: {
          address: string | null
          class_x_percentage: number | null
          class_x_school: string | null
          class_x_year: number | null
          class_xii_percentage: number | null
          class_xii_school: string | null
          class_xii_year: number | null
          created_at: string
          current_company: string | null
          current_ctc: number | null
          date_of_birth: string | null
          degree_cgpa: number | null
          degree_institution: string | null
          degree_name: string | null
          degree_year: number | null
          email: string
          expected_ctc: number | null
          full_name: string
          gender: string | null
          id: string
          nationality: string | null
          phone: string | null
          primary_resume_url: string | null
          profile_image_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          class_x_percentage?: number | null
          class_x_school?: string | null
          class_x_year?: number | null
          class_xii_percentage?: number | null
          class_xii_school?: string | null
          class_xii_year?: number | null
          created_at?: string
          current_company?: string | null
          current_ctc?: number | null
          date_of_birth?: string | null
          degree_cgpa?: number | null
          degree_institution?: string | null
          degree_name?: string | null
          degree_year?: number | null
          email: string
          expected_ctc?: number | null
          full_name: string
          gender?: string | null
          id?: string
          nationality?: string | null
          phone?: string | null
          primary_resume_url?: string | null
          profile_image_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          class_x_percentage?: number | null
          class_x_school?: string | null
          class_x_year?: number | null
          class_xii_percentage?: number | null
          class_xii_school?: string | null
          class_xii_year?: number | null
          created_at?: string
          current_company?: string | null
          current_ctc?: number | null
          date_of_birth?: string | null
          degree_cgpa?: number | null
          degree_institution?: string | null
          degree_name?: string | null
          degree_year?: number | null
          email?: string
          expected_ctc?: number | null
          full_name?: string
          gender?: string | null
          id?: string
          nationality?: string | null
          phone?: string | null
          primary_resume_url?: string | null
          profile_image_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          created_at: string
          description: string
          id: string
          is_active: boolean | null
          job_function: string | null
          job_type: string
          location: string
          requirements: string[] | null
          responsibilities: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_active?: boolean | null
          job_function?: string | null
          job_type: string
          location: string
          requirements?: string[] | null
          responsibilities?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean | null
          job_function?: string | null
          job_type?: string
          location?: string
          requirements?: string[] | null
          responsibilities?: string[] | null
          title?: string
          updated_at?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
