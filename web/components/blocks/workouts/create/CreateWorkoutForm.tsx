'use client';

import { useEffect, useState } from 'react';
import { Database } from '@/database.types';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import Stage1 from './Stage1';
import Stage2 from './Stage2';
import { useFormState, useFormStatus } from 'react-dom';
import { createNewWorkout } from '@/lib/workouts/create';
import { redirect } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

export type Exercise = Database['public']['Tables']['exercise']['Row'];

export type WorkoutExercise = {
  id: string;
  exercise: Exercise;
  sets: ExerciseSet[];
  sortOrder: number;
};

export type ExerciseSet = {
  id: string;
  reps: number | null;
  weight: number | null;
};

export type NewWorkout = {
  name: string;
  equipment: string;
  exercises: WorkoutExercise[];
};

const initialState = {
  errorMessage: null,
  success: false,
};

export default function CreateWorkoutForm() {
  const supabase = createClient();

  const [state, formAction] = useFormState(createNewWorkout, initialState);
  const { pending } = useFormStatus();

  const [formStage, setFormStage] = useState<number>(1);

  const [error, setError] = useState<string | null>(null);

  const [newWorkout, setNewWorkout] = useState<NewWorkout>({
    name: '',
    equipment: '',
    exercises: [],
  });

  const [allExercises, setAllExercises] = useState<Exercise[] | null>(null);
  const [exercises, setExercises] = useState<Exercise[] | null>(null);

  useEffect(() => {
    async function fetchExercises() {
      const { data, error } = await supabase.from('exercise').select('*');

      if (error) {
        console.error(error);
      }

      setAllExercises(data);
      setExercises(data);
    }

    fetchExercises();
  }, [supabase]);

  function handleStage2Change(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setError(null);

    if (
      newWorkout.name !== '' &&
      newWorkout.equipment !== '' &&
      newWorkout.exercises.length > 0
    ) {
      setFormStage(2);
    } else {
      setError('Please fill in all fields');
    }
  }

  const { toast } = useToast();

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Workout created',
        description: 'View your new workout in your dashboard',
      });
      redirect('/');
    }
  }, [state.success, toast]);

  return (
    <form className='flex flex-col gap-4' action={formAction}>
      <input type='hidden' name='workout' value={JSON.stringify(newWorkout)} />
      {formStage === 1 && (
        <Stage1
          exercises={exercises}
          setExercises={setExercises}
          allExercises={allExercises}
          newWorkout={newWorkout}
          setNewWorkout={setNewWorkout}
        />
      )}
      {formStage === 2 && (
        <Stage2
          newWorkout={newWorkout}
          setNewWorkout={setNewWorkout}
          allExercises={allExercises}
          setExercises={setExercises}
        />
      )}

      <div className='flex gap-2'>
        {formStage === 1 && (
          <Button asChild variant='secondary'>
            <button type='button' onClick={handleStage2Change}>
              Continue
            </button>
          </Button>
        )}
        {formStage === 2 && (
          <Button asChild variant='default'>
            <button type='submit' disabled={pending}>
              Create Workout
            </button>
          </Button>
        )}
        {formStage === 2 && (
          <Button asChild variant='ghost' className='ml-auto'>
            <button
              type='button'
              onClick={(e) => {
                e.preventDefault();
                setFormStage(formStage - 1);
              }}
            >
              Back
            </button>
          </Button>
        )}
      </div>

      {error && <p className='text-sm text-red-500'>{error}</p>}
      {state.errorMessage && (
        <p className='text-sm text-red-500'>{state.errorMessage}</p>
      )}
    </form>
  );
}
