import { createClient } from '@/utils/supabase/server';
import { User } from '@supabase/supabase-js';
import React from 'react';

interface Props {
  user: User;
}

export default async function FavouriteExercises({ user }: Props) {
  const supabase = createClient();

  const { data: exercises } = await supabase
    .from('workout_exercises')
    .select(
      'id, exercise(name), workout_exercise_instance(workout_set_instance(reps))'
    )
    .eq('user_id', user.id)
    .order('count_workout_exercises', { ascending: false })
    .limit(5);

  return (
    <>
      {exercises?.map((exercise) => (
        <div className='flex items-center gap-4' key={exercise.id}>
          <div className='grid gap-1'>
            <p className='text-sm font-medium leading-none'>
              {exercise.exercise?.name}
            </p>
            <p className='text-sm text-muted-foreground'>
              {exercise.workout_exercise_instance.length} times,{' '}
              {exercise.workout_exercise_instance.reduce((arr, curr) => {
                return (
                  arr +
                  curr.workout_set_instance.reduce((a) => {
                    return a + 1;
                  }, 0)
                );
              }, 0)}{' '}
              sets,{' '}
              {exercise.workout_exercise_instance.reduce((arr, curr) => {
                return (
                  arr +
                  curr.workout_set_instance.reduce((a, c) => {
                    return a + (c.reps ?? 0);
                  }, 0)
                );
              }, 0)}{' '}
              reps
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
