export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type UserStreakRow = {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  daily_goal_completed: boolean;
  updated_at: string;
};

type QuizAttemptRow = {
  id: string;
  user_id: string;
  algorithm_id: string;
  score: number;
  total_questions: number;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          full_name: string | null;
          gender: string | null;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          full_name?: string | null;
          gender?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          first_name?: string | null;
          last_name?: string | null;
          full_name?: string | null;
          gender?: string | null;
          email?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          user_id: string;
          preferred_language: string;
          preferred_code_language: string;
          theme: string;
          animation_speed: string;
          reduced_motion: boolean;
          difficulty_level: string;
          default_visualizer_mode: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          preferred_language?: string;
          preferred_code_language?: string;
          theme?: string;
          animation_speed?: string;
          reduced_motion?: boolean;
          difficulty_level?: string;
          default_visualizer_mode?: string;
          updated_at?: string;
        };
        Update: {
          preferred_language?: string;
          preferred_code_language?: string;
          theme?: string;
          animation_speed?: string;
          reduced_motion?: boolean;
          difficulty_level?: string;
          default_visualizer_mode?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          algorithm_id: string;
          status: "not_started" | "in_progress" | "completed" | "needs_revision";
          completion_percentage: number;
          time_spent_seconds: number;
          practice_accuracy: number | null;
          last_practiced_at: string | null;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          algorithm_id: string;
          status?: "not_started" | "in_progress" | "completed" | "needs_revision";
          completion_percentage?: number;
          time_spent_seconds?: number;
          practice_accuracy?: number | null;
          last_practiced_at?: string | null;
          completed_at?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_progress"]["Insert"]>;
        Relationships: [];
      };
      user_streaks: {
        Row: UserStreakRow;
        Insert: {
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_active_date?: string | null;
          daily_goal_completed?: boolean;
          updated_at?: string;
        };
        Update: Partial<Omit<UserStreakRow, "user_id">>;
        Relationships: [];
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          bookmark_type: "algorithm" | "step" | "code" | "session";
          data_structure_id: string | null;
          operation_id: string | null;
          algorithm_id: string | null;
          step_number: number | null;
          title: string;
          description: string | null;
          serialized_state: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bookmark_type?: "algorithm" | "step" | "code" | "session";
          data_structure_id?: string | null;
          operation_id?: string | null;
          algorithm_id?: string | null;
          step_number?: number | null;
          title: string;
          description?: string | null;
          serialized_state?: Json | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookmarks"]["Insert"]>;
        Relationships: [];
      };
      saved_visualizer_sessions: {
        Row: {
          id: string;
          user_id: string;
          algorithm_id: string | null;
          title: string | null;
          input_data: Json;
          current_step: number;
          visual_state: Json | null;
          speed: string;
          code_language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          algorithm_id?: string | null;
          title?: string | null;
          input_data: Json;
          current_step?: number;
          visual_state?: Json | null;
          speed?: string;
          code_language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["saved_visualizer_sessions"]["Insert"]>;
        Relationships: [];
      };
      quiz_attempts: {
        Row: QuizAttemptRow;
        Insert: {
          id?: string;
          user_id: string;
          algorithm_id: string;
          score: number;
          total_questions: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["quiz_attempts"]["Insert"]>;
        Relationships: [];
      };
      activity_timeline: {
        Row: {
          id: string;
          user_id: string;
          action_type: string;
          algorithm_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action_type: string;
          algorithm_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          action_type?: string;
          algorithm_id?: string | null;
          metadata?: Json;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      touch_user_streak: {
        Args: Record<PropertyKey, never>;
        Returns: UserStreakRow;
      };
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
        Returns: QuizAttemptRow[];
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
