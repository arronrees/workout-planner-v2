'use server';

import { Database } from '@/database.types';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { checkCreateWorkoutObjectValid } from '../validation';

type Exercise = Database['public']['Tables']['exercise']['Row'];

type WorkoutExercise = {
  id: string;
  exercise: Exercise;
  sets: ExerciseSet[];
  sortOrder: number;
};

type ExerciseSet = {
  id: string;
  reps: number | null;
  weight: number | null;
};

type NewWorkout = {
  name: string;
  equipment: string;
  muscle: string;
  exercises: WorkoutExercise[];
};

export async function createNewWorkout(
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

  const data = JSON.parse(formData.get('workout') as string) as NewWorkout;

  const { success, error: validationError } =
    await checkCreateWorkoutObjectValid(data);

  if (validationError) {
    console.error('Create Workout Validation Error: ', validationError);

    return { errorMessage: validationError, success: false };
  }

  const { error: workoutError, data: workoutData } = await supabase
    .from('workouts')
    .insert({
      name: data.name,
      muscle_focus: data.muscle,
      equipment_needed: data.equipment,
      user_id: user.id,
    })
    .select()
    .single();

  if (workoutError) {
    console.log(workoutError);
    return { errorMessage: 'Could not add workout', success: false };
  }

  let exerciseError = null;
  let setsError = null;

  for (let i = 0; i < data.exercises.length; i++) {
    const exerciseInstance = data.exercises[i];

    const { error, data: exerciseData } = await supabase
      .from('workout_exercises')
      .insert({
        exercise_id: exerciseInstance.exercise.id,
        workout_id: workoutData.id,
        user_id: user.id,
        sort_order: exerciseInstance.sortOrder,
      })
      .select()
      .single();

    if (exerciseData) {
      const { error: setError } = await supabase.from('workout_sets').insert(
        exerciseInstance.sets.map((set) => ({
          reps: set.reps,
          weight: set.weight,
          workout_exercise_id: exerciseData?.id,
          user_id: user.id,
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
