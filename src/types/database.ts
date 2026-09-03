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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_timeline: {
        Row: {
          action_type: string
          algorithm_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          action_type: string
          algorithm_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          action_type?: string
          algorithm_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          algorithm_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          algorithm_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          algorithm_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_challenges: {
        Row: {
          algorithm_id: string
          challenge_date: string
          created_at: string | null
          id: string
        }
        Insert: {
          algorithm_id: string
          challenge_date: string
          created_at?: string | null
          id?: string
        }
        Update: {
          algorithm_id?: string
          challenge_date?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      mental_math_daily_attempts: {
        Row: {
          accuracy: number
          challenge_date: string
          created_at: string | null
          id: string
          score: number
          solve_time_ms: number
          user_id: string
          verified: boolean | null
        }
        Insert: {
          accuracy: number
          challenge_date: string
          created_at?: string | null
          id?: string
          score: number
          solve_time_ms: number
          user_id: string
          verified?: boolean | null
        }
        Update: {
          accuracy?: number
          challenge_date?: string
          created_at?: string | null
          id?: string
          score?: number
          solve_time_ms?: number
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      mental_math_mastery: {
        Row: {
          accuracy: number
          average_speed_ms: number
          by_digit_complexity: Json | null
          level: number
          operation: string
          total_attempts: number
          total_correct: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accuracy?: number
          average_speed_ms?: number
          by_digit_complexity?: Json | null
          level?: number
          operation: string
          total_attempts?: number
          total_correct?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accuracy?: number
          average_speed_ms?: number
          by_digit_complexity?: Json | null
          level?: number
          operation?: string
          total_attempts?: number
          total_correct?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mental_math_sessions: {
        Row: {
          accuracy_percentage: number
          answers: Json | null
          average_solve_time_ms: number
          correct_count: number
          created_at: string | null
          difficulty: string
          final_score: number
          generator_version: string
          hints_used: number
          id: string
          max_combo: number
          mode: string
          operation: string
          score_version: string
          total_questions: number
          total_time_ms: number
          user_id: string
        }
        Insert: {
          accuracy_percentage: number
          answers?: Json | null
          average_solve_time_ms: number
          correct_count: number
          created_at?: string | null
          difficulty: string
          final_score: number
          generator_version?: string
          hints_used?: number
          id?: string
          max_combo?: number
          mode: string
          operation: string
          score_version?: string
          total_questions: number
          total_time_ms: number
          user_id: string
        }
        Update: {
          accuracy_percentage?: number
          answers?: Json | null
          average_solve_time_ms?: number
          correct_count?: number
          created_at?: string | null
          difficulty?: string
          final_score?: number
          generator_version?: string
          hints_used?: number
          id?: string
          max_combo?: number
          mode?: string
          operation?: string
          score_version?: string
          total_questions?: number
          total_time_ms?: number
          user_id?: string
        }
        Relationships: []
      }
      mental_math_user_stats: {
        Row: {
          best_daily_score: number
          current_streak_days: number
          fastest_speed_qpm: number
          highest_combo: number
          highest_score: number
          last_played_date: string | null
          max_streak_days: number
          overall_accuracy: number
          total_correct: number
          total_questions_solved: number
          total_sessions_completed: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          best_daily_score?: number
          current_streak_days?: number
          fastest_speed_qpm?: number
          highest_combo?: number
          highest_score?: number
          last_played_date?: string | null
          max_streak_days?: number
          overall_accuracy?: number
          total_correct?: number
          total_questions_solved?: number
          total_sessions_completed?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          best_daily_score?: number
          current_streak_days?: number
          fastest_speed_qpm?: number
          highest_combo?: number
          highest_score?: number
          last_played_date?: string | null
          max_streak_days?: number
          overall_accuracy?: number
          total_correct?: number
          total_questions_solved?: number
          total_sessions_completed?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      preferences: {
        Row: {
          code_language: string | null
          difficulty: string | null
          id: string
          speed: number | null
          theme: string | null
          updated_at: string | null
        }
        Insert: {
          code_language?: string | null
          difficulty?: string | null
          id: string
          speed?: number | null
          theme?: string | null
          updated_at?: string | null
        }
        Update: {
          code_language?: string | null
          difficulty?: string | null
          id?: string
          speed?: number | null
          theme?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          algorithm_id: string
          created_at: string | null
          id: string
          score: number
          total_questions: number
          user_id: string
        }
        Insert: {
          algorithm_id: string
          created_at?: string | null
          id?: string
          score: number
          total_questions: number
          user_id: string
        }
        Update: {
          algorithm_id?: string
          created_at?: string | null
          id?: string
          score?: number
          total_questions?: number
          user_id?: string
        }
        Relationships: []
      }
      saved_visualizer_sessions: {
        Row: {
          algorithm_id: string | null
          code_language: string | null
          created_at: string | null
          current_step: number | null
          id: string
          input_data: Json
          speed: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          visual_state: Json | null
        }
        Insert: {
          algorithm_id?: string | null
          code_language?: string | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          input_data: Json
          speed?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          visual_state?: Json | null
        }
        Update: {
          algorithm_id?: string | null
          code_language?: string | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          input_data?: Json
          speed?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          visual_state?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_visualizer_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          animation_speed: string | null
          default_visualizer_mode: string | null
          difficulty_level: string | null
          preferred_code_language: string | null
          preferred_language: string | null
          reduced_motion: boolean | null
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          animation_speed?: string | null
          default_visualizer_mode?: string | null
          difficulty_level?: string | null
          preferred_code_language?: string | null
          preferred_language?: string | null
          reduced_motion?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          animation_speed?: string | null
          default_visualizer_mode?: string | null
          difficulty_level?: string | null
          preferred_code_language?: string | null
          preferred_language?: string | null
          reduced_motion?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          algorithm_id: string
          completed_at: string | null
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          algorithm_id: string
          completed_at?: string | null
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          algorithm_id?: string
          completed_at?: string | null
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          current_streak: number | null
          last_activity_date: string | null
          max_streak: number | null
          user_id: string
        }
        Insert: {
          current_streak?: number | null
          last_activity_date?: string | null
          max_streak?: number | null
          user_id: string
        }
        Update: {
          current_streak?: number | null
          last_activity_date?: string | null
          max_streak?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      mark_algorithm_completed: {
        Args: { p_algorithm_id: string };
        Returns: undefined;
      };
      record_quiz_attempt: {
        Args: {
          p_algorithm_id: string;
          p_score: number;
          p_total_questions: number;
        };
        Returns: Database["public"]["Tables"]["quiz_attempts"]["Row"][];
      };
      touch_user_streak: {
        Args: Record<PropertyKey, never>;
        Returns: Database["public"]["Tables"]["user_streaks"]["Row"];
      };
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
