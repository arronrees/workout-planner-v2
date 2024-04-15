import { createClient } from '@/utils/supabase/server';
import { User } from '@supabase/supabase-js';
import React from 'react';

interface Props {
  user: User;
}

export default async function FavouriteExercises({ user }: Props) {
  const supabase = createClient();

  const { data: exercises } = await supabase
    .from('exercise')
    .select('*, workout_exercise_instance(workout_set_instance(*))')
    .filter('workout_exercise_instance', 'not.is', null)
    .eq('workout_exercise_instance.user_id', user.id);

  const sortedExercises = exercises?.sort((a, b) => {
    const aTotalReps = a.workout_exercise_instance.reduce((arr, curr) => {
      return (
        arr +
        curr.workout_set_instance.reduce((a, c) => {
          return a + (c.reps ?? 0);
        }, 0)
      );
    }, 0);
    const bTotalReps = b.workout_exercise_instance.reduce((arr, curr) => {
      return (
        arr +
        curr.workout_set_instance.reduce((a, c) => {
          return a + (c.reps ?? 0);
        }, 0)
      );
    }, 0);

    if (aTotalReps > bTotalReps) {
      return -1;
    }
    if (aTotalReps < bTotalReps) {
      return 1;
    }
    return 0;
  });

  const filteredExercises = sortedExercises?.slice(0, 10);

  if (!filteredExercises) {
    return <p className='font-medium text-lg'>No exercises performed yet.</p>;
  }

  return (
    <>
      {filteredExercises.map((exercise) => (
        <div className='flex items-center gap-4' key={exercise.id}>
          <div className='grid gap-1'>
            <p className='text-sm font-medium leading-none'>{exercise.name}</p>
            <p className='text-sm text-muted-foreground'>
              {exercise.workout_exercise_instance.reduce((arr, curr) => {
                return (
                  arr +
                  curr.workout_set_instance.reduce((a, c) => {
                    return a + (c.reps ?? 0);
                  }, 0)
                );
              }, 0)}{' '}
              reps performed
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
