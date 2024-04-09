'use server';

import { Database } from '@/database.types';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  checkCreateWorkoutObjectValid,
  checkRecordWorkoutObjectValid,
} from '../validation';

type Exercise = Database['public']['Tables']['exercise']['Row'];

type Workout = Database['public']['Tables']['workouts']['Row'] & {
  workout_exercises: Array<
    Database['public']['Tables']['workout_exercises']['Row'] & {
      exercise: Database['public']['Tables']['exercise']['Row'];
      workout_sets: Array<Database['public']['Tables']['workout_sets']['Row']>;
    }
  >;
};

export async function recordNewWorkout(
  prevState: {
    errorMessage: string | null;
    success: boolean;
  },
  formData: FormData
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { errorMessage: 'User not found', success: false };
  }

  const data = JSON.parse(formData.get('workout') as string) as Workout;

  const workoutToParse = {
    id: data.id,
    name: data.name,
    equipment: data.equipment_needed,
    muscle: data.muscle_focus,
    exercises: data.workout_exercises.map((workoutExercise) => ({
      id: workoutExercise.id,
      exercise: workoutExercise.exercise,
      sets: workoutExercise.workout_sets.map((set) => ({
        id: set.id,
        reps: set.reps,
        weight: set.weight,
      })),
      sortOrder: workoutExercise.sort_order,
    })),
  };

  const { success, error: validationError } =
    await checkRecordWorkoutObjectValid(workoutToParse);

  if (validationError) {
    console.error('Record Workout Validation Error: ', validationError);

    return { errorMessage: validationError, success: false };
  }

  const { error: workoutError, data: workoutData } = await supabase
    .from('workout_instance')
    .insert({
      workout_id: workoutToParse.id,
      name: workoutToParse.name,
      equipment_needed: workoutToParse.equipment,
      muscle_focus: workoutToParse.muscle,
      user_id: user.id,
    })
    .select()
    .single();

  if (workoutError) {
    console.log(workoutError);
    return { errorMessage: 'Could not record workout', success: false };
  }

  let exerciseError = null;
  let setsError = null;

  for (let i = 0; i < data.workout_exercises.length; i++) {
    const exerciseInstance = data.workout_exercises[i];

    const { error, data: exerciseData } = await supabase
      .from('workout_exercise_instance')
      .insert({
        workout_exercise_id: exerciseInstance.id,
        workout_instance_id: workoutData.id,
        exercise_id: exerciseInstance.exercise.id,
        user_id: user.id,
        sort_order: exerciseInstance.sort_order,
      })
      .select()
      .single();

    if (exerciseData) {
      const { error: setError } = await supabase
        .from('workout_set_instance')
        .insert(
          exerciseInstance.workout_sets.map((set) => ({
            workout_exercise_instance_id: exerciseData.id,
            workout_exercise_id: exerciseInstance.id,
            user_id: user.id,
            reps: set.reps,
            weight: set.weight,
          }))
        );

      if (setError) {
        setsError = setError;
      }
    }

    if (error) {
      exerciseError = error;
    }
  }

  if (exerciseError) {
    console.log(exerciseError);

    return {
      errorMessage: 'Error adding exercises to workout',
      success: false,
    };
  }

  revalidatePath('/', 'layout');
  return { errorMessage: null, success: true };
}
