export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type TableDefinition<Row, Insert, Update = Partial<Insert>, Relationships = []> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: Relationships;
};

type ActivityTimelineRow = {
  action_type: string;
  algorithm_id: string;
  created_at: string | null;
  id: string;
  metadata: Json | null;
  user_id: string;
};

type BookmarkRow = {
  algorithm_id: string;
  created_at: string | null;
  id: string;
  user_id: string;
};

type DailyChallengeRow = {
  algorithm_id: string;
  challenge_date: string;
  created_at: string | null;
  id: string;
};

type PreferenceRow = {
  code_language: string | null;
  difficulty: string | null;
  id: string;
  speed: number | null;
  theme: string | null;
  updated_at: string | null;
};

type ProfileRow = {
  avatar_url: string | null;
  id: string;
  updated_at: string | null;
  username: string | null;
};

type QuizAttemptRow = {
  algorithm_id: string;
  created_at: string | null;
  id: string;
  score: number;
  total_questions: number;
  user_id: string;
};

type SavedVisualizerSessionRow = {
  algorithm_id: string | null;
  code_language: string | null;
  created_at: string | null;
  current_step: number | null;
  id: string;
  input_data: Json;
  speed: string | null;
  title: string | null;
  updated_at: string | null;
  user_id: string;
  visual_state: Json | null;
};

type UserPreferenceRow = {
  animation_speed: string | null;
  default_visualizer_mode: string | null;
  difficulty_level: string | null;
  preferred_code_language: string | null;
  preferred_language: string | null;
  reduced_motion: boolean | null;
  theme: string | null;
  updated_at: string | null;
  user_id: string;
};

type UserProgressRow = {
  algorithm_id: string;
  completed_at: string | null;
  id: string;
  status: string | null;
  user_id: string;
};

type UserStreakRow = {
  current_streak: number | null;
  last_activity_date: string | null;
  max_streak: number | null;
  user_id: string;
};

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      activity_timeline: TableDefinition<
        ActivityTimelineRow,
        {
          action_type: string;
          algorithm_id: string;
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          user_id: string;
        }
      >;
      bookmarks: TableDefinition<
        BookmarkRow,
        {
          algorithm_id: string;
          created_at?: string | null;
          id?: string;
          user_id: string;
        }
      >;
      daily_challenges: TableDefinition<
        DailyChallengeRow,
        {
          algorithm_id: string;
          challenge_date: string;
          created_at?: string | null;
          id?: string;
        }
      >;
      preferences: TableDefinition<
        PreferenceRow,
        {
          code_language?: string | null;
          difficulty?: string | null;
          id: string;
          speed?: number | null;
          theme?: string | null;
          updated_at?: string | null;
        }
      >;
      profiles: TableDefinition<
        ProfileRow,
        {
          avatar_url?: string | null;
          id: string;
          updated_at?: string | null;
          username?: string | null;
        }
      >;
      quiz_attempts: TableDefinition<
        QuizAttemptRow,
        {
          algorithm_id: string;
          created_at?: string | null;
          id?: string;
          score: number;
          total_questions: number;
          user_id: string;
        }
      >;
      saved_visualizer_sessions: TableDefinition<
        SavedVisualizerSessionRow,
        {
          algorithm_id?: string | null;
          code_language?: string | null;
          created_at?: string | null;
          current_step?: number | null;
          id?: string;
          input_data: Json;
          speed?: string | null;
          title?: string | null;
          updated_at?: string | null;
          user_id: string;
          visual_state?: Json | null;
        },
        Partial<SavedVisualizerSessionRow>,
        [
          {
            foreignKeyName: "saved_visualizer_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ]
      >;
      user_preferences: TableDefinition<
        UserPreferenceRow,
        {
          animation_speed?: string | null;
          default_visualizer_mode?: string | null;
          difficulty_level?: string | null;
          preferred_code_language?: string | null;
          preferred_language?: string | null;
          reduced_motion?: boolean | null;
          theme?: string | null;
          updated_at?: string | null;
          user_id: string;
        },
        Partial<UserPreferenceRow>,
        [
          {
            foreignKeyName: "user_preferences_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ]
      >;
      user_progress: TableDefinition<
        UserProgressRow,
        {
          algorithm_id: string;
          completed_at?: string | null;
          id?: string;
          status?: string | null;
          user_id: string;
        }
      >;
      user_streaks: TableDefinition<
        UserStreakRow,
        {
          current_streak?: number | null;
          last_activity_date?: string | null;
          max_streak?: number | null;
          user_id: string;
        }
      >;
    };
    Views: { [_ in never]: never };
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
        Returns: QuizAttemptRow[];
      };
      touch_user_streak: {
        Args: Record<PropertyKey, never>;
        Returns: UserStreakRow;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
