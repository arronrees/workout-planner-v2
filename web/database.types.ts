/* eslint-disable */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      exercise: {
        Row: {
          created_at: string;
          equipment_needed: string;
          id: string;
          muscle_group: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          equipment_needed: string;
          id?: string;
          muscle_group: string;
          name: string;
        };
        Update: {
          created_at?: string;
          equipment_needed?: string;
          id?: string;
          muscle_group?: string;
          name?: string;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          created_at: string;
          id: string;
          user_id: string;
          weight_unit: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          user_id?: string;
          weight_unit?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          user_id?: string;
          weight_unit?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_user_preferences_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      user_profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          user_id: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          user_id: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_user_profile_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      workout_exercise_instance: {
        Row: {
          created_at: string;
          exercise_id: string | null;
          id: string;
          sort_order: number | null;
          user_id: string | null;
          workout_exercise_id: string | null;
          workout_instance_id: string;
        };
        Insert: {
          created_at?: string;
          exercise_id?: string | null;
          id?: string;
          sort_order?: number | null;
          user_id?: string | null;
          workout_exercise_id?: string | null;
          workout_instance_id: string;
        };
        Update: {
          created_at?: string;
          exercise_id?: string | null;
          id?: string;
          sort_order?: number | null;
          user_id?: string | null;
          workout_exercise_id?: string | null;
          workout_instance_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_workout_exercise_instance_exercise_id_fkey';
            columns: ['exercise_id'];
            isOneToOne: false;
            referencedRelation: 'exercise';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_workout_exercise_instance_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_workout_exercise_instance_workout_exercise_id_fkey';
            columns: ['workout_exercise_id'];
            isOneToOne: false;
            referencedRelation: 'workout_exercises';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_workout_exercise_instance_workout_instance_id_fkey';
            columns: ['workout_instance_id'];
            isOneToOne: false;
            referencedRelation: 'workout_instance';
            referencedColumns: ['id'];
          }
        ];
      };
      workout_exercises: {
        Row: {
          created_at: string;
          exercise_id: string | null;
          id: string;
          sort_order: number;
          user_id: string | null;
          workout_id: string;
        };
        Insert: {
          created_at?: string;
          exercise_id?: string | null;
          id?: string;
          sort_order: number;
          user_id?: string | null;
          workout_id: string;
        };
        Update: {
          created_at?: string;
          exercise_id?: string | null;
          id?: string;
          sort_order?: number;
          user_id?: string | null;
          workout_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_workout_exercises_exercise_id_fkey';
            columns: ['exercise_id'];
            isOneToOne: false;
            referencedRelation: 'exercise';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_workout_exercises_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_workout_exercises_workout_id_fkey';
            columns: ['workout_id'];
            isOneToOne: false;
            referencedRelation: 'workouts';
            referencedColumns: ['id'];
          }
        ];
      };
      workout_instance: {
        Row: {
          created_at: string;
          equipment_needed: string | null;
          id: string;
          name: string | null;
          user_id: string | null;
          workout_id: string | null;
        };
        Insert: {
          created_at?: string;
          equipment_needed?: string | null;
          id?: string;
          name?: string | null;
          user_id?: string | null;
          workout_id?: string | null;
        };
        Update: {
          created_at?: string;
          equipment_needed?: string | null;
          id?: string;
          name?: string | null;
          user_id?: string | null;
          workout_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_workout_instance_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_workout_instance_workout_id_fkey';
            columns: ['workout_id'];
            isOneToOne: false;
            referencedRelation: 'workouts';
            referencedColumns: ['id'];
          }
        ];
      };
      workout_set_instance: {
        Row: {
          created_at: string;
          id: string;
          reps: number | null;
          total_weight: number | null;
          user_id: string | null;
          weight: number | null;
          workout_exercise_id: string | null;
          workout_exercise_instance_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          reps?: number | null;
          total_weight?: number | null;
          user_id?: string | null;
          weight?: number | null;
          workout_exercise_id?: string | null;
          workout_exercise_instance_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          reps?: number | null;
          total_weight?: number | null;
          user_id?: string | null;
          weight?: number | null;
          workout_exercise_id?: string | null;
          workout_exercise_instance_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_workout_set_instance_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_workout_set_instance_workout_exercise_id_fkey';
            columns: ['workout_exercise_id'];
            isOneToOne: false;
            referencedRelation: 'workout_exercises';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_workout_set_instance_workout_exercise_instance_id_fkey';
            columns: ['workout_exercise_instance_id'];
            isOneToOne: false;
            referencedRelation: 'workout_exercise_instance';
            referencedColumns: ['id'];
          }
        ];
      };
      workout_sets: {
        Row: {
          created_at: string;
          id: string;
          reps: number | null;
          user_id: string | null;
          weight: number | null;
          workout_exercise_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          reps?: number | null;
          user_id?: string | null;
          weight?: number | null;
          workout_exercise_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          reps?: number | null;
          user_id?: string | null;
          weight?: number | null;
          workout_exercise_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_workout_sets_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_workout_sets_workout_exercise_id_fkey';
            columns: ['workout_exercise_id'];
            isOneToOne: false;
            referencedRelation: 'workout_exercises';
            referencedColumns: ['id'];
          }
        ];
      };
      workouts: {
        Row: {
          created_at: string;
          equipment_needed: string;
          id: string;
          name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          equipment_needed?: string;
          id?: string;
          name: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          equipment_needed?: string;
          id?: string;
          name?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_workouts_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
      PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
      PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never;
