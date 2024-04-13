'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Database } from '@/database.types';
import { ChevronDown, ChevronUp, XIcon } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import randomstring from 'randomstring';
import { useToast } from '@/components/ui/use-toast';
import { useFormState, useFormStatus } from 'react-dom';
import { recordNewWorkout } from '@/lib/workouts/record';
import { redirect } from 'next/navigation';

interface Props {
  workout: Workout;
}

type Workout = Database['public']['Tables']['workouts']['Row'] & {
  workout_exercises: Array<
    Database['public']['Tables']['workout_exercises']['Row'] & {
      exercise: Database['public']['Tables']['exercise']['Row'] | null;
      workout_sets: Array<Database['public']['Tables']['workout_sets']['Row']>;
    }
  >;
};

const initialState = {
  errorMessage: null,
  success: false,
};

export default function RecordWorkoutForm({ workout }: Props) {
  const [newWorkout, setNewWorkout] = useState<Workout>({
    ...workout,
  });

  const [state, formAction] = useFormState(recordNewWorkout, initialState);
  const { pending } = useFormStatus();

  function removeSelectedExercise(id: string, sort_order: number) {
    setNewWorkout((prev) => ({
      ...prev,
      workout_exercises: prev.workout_exercises
        .filter((exerciseInstance) => exerciseInstance.exercise?.id !== id)
        .map((exerciseInstance) =>
          exerciseInstance.sort_order > sort_order
            ? {
                ...exerciseInstance,
                sort_order: exerciseInstance.sort_order - 1,
              }
            : exerciseInstance
        ),
    }));
  }

  function reSortExercises(id: string, sortFrom: number, sortTo: number) {
    setNewWorkout((prev) => ({
      ...prev,
      workout_exercises: prev.workout_exercises.map((exerciseInstance) => {
        // if already on lowest or highest position, return the same
        if (sortTo < 0 || sortTo >= prev.workout_exercises.length) {
          return exerciseInstance;
        }

        // change the sort order of the clicked exercise instance
        if (exerciseInstance.id === id) {
          return {
            ...exerciseInstance,
            sort_order: sortTo,
          };
        }

        // change the sort order of the exercise instance that was swapped with the clicked exercise instance
        if (exerciseInstance.sort_order === sortTo) {
          return {
            ...exerciseInstance,
            sort_order: sortFrom,
          };
        }

        return exerciseInstance;
      }),
    }));
  }

  const { toast } = useToast();

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Workout recorded',
        description: 'View your recorded workout in your dashboard',
      });
      redirect(`/workouts/${workout.id}`);
    }
  }, [state.success, toast, workout]);

  return (
    <form className='flex flex-col gap-4' action={formAction}>
      <input type='hidden' name='workout' value={JSON.stringify(newWorkout)} />
      {newWorkout.workout_exercises
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((exercise) => (
          <Card key={exercise.id}>
            <CardHeader className='p-4'>
              <div className='flex gap-2 justify-between items-end'>
                <div>
                  <CardTitle className='text-sm'>
                    {exercise.exercise?.name}
                  </CardTitle>
                  <CardDescription className='text-xs'>
                    Add sets and reps
                  </CardDescription>
                </div>
                <div className='flex gap-1'>
                  {exercise.sort_order > 0 && (
                    <Button
                      variant='outline'
                      className='max-w-max h-max p-2'
                      type='button'
                      onClick={() => {
                        reSortExercises(
                          exercise.id,
                          exercise.sort_order,
                          exercise.sort_order - 1
                        );
                      }}
                    >
                      <ChevronUp className='w-3 h-3' />
                    </Button>
                  )}
                  {exercise.sort_order !==
                    newWorkout.workout_exercises.length - 1 && (
                    <Button
                      variant='outline'
                      className='max-w-max h-max p-2'
                      type='button'
                      onClick={() => {
                        reSortExercises(
                          exercise.id,
                          exercise.sort_order,
                          exercise.sort_order + 1
                        );
                      }}
                    >
                      <ChevronDown className='w-3 h-3' />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className='p-4 pt-0'>
              <Sets
                sets={exercise.workout_sets}
                setNewWorkout={setNewWorkout}
                exerciseInstance={exercise}
              />
            </CardContent>
            <CardFooter className='p-4 pt-0'>
              <Button
                variant='ghost'
                type='button'
                onClick={(e) => {
                  e.preventDefault();

                  if (exercise.exercise) {
                    removeSelectedExercise(
                      exercise.exercise.id,
                      exercise.sort_order
                    );
                  }
                }}
                className='flex gap-2 items-center ml-auto p-2 h-auto text-xs'
              >
                Remove Exercise
                <XIcon className='w-3 h-3' />
              </Button>
            </CardFooter>
          </Card>
        ))}
      <div>
        <Button asChild variant='default'>
          <button type='submit' disabled={pending}>
            Finish Workout
          </button>
        </Button>
      </div>
      {state.errorMessage && (
        <p className='text-sm text-red-500'>{state.errorMessage}</p>
      )}
    </form>
  );
}

interface SetsProps {
  sets: Database['public']['Tables']['workout_sets']['Row'][];
  setNewWorkout: Dispatch<SetStateAction<Workout>>;
  exerciseInstance: Database['public']['Tables']['workout_exercises']['Row'];
}

function Sets({ sets, setNewWorkout, exerciseInstance }: SetsProps) {
  function addSet(e: React.FormEvent) {
    e.preventDefault();

    setNewWorkout((prev) => ({
      ...prev,
      workout_exercises: prev.workout_exercises.map((exercise) => {
        if (exercise.id === exerciseInstance.id) {
          return {
            ...exercise,
            workout_sets: [
              ...exercise.workout_sets,
              {
                id: randomstring.generate(8),
                created_at: new Date().toDateString(),
                reps: 0,
                weight: 0,
                user_id: exercise.user_id,
                workout_exercise_id: exercise.id,
              },
            ],
          };
        }

        return exercise;
      }),
    }));
  }

  return (
    <Card className='bg-slate-50/60'>
      <CardContent className='p-4'>
        <div className='flex flex-col gap-2'>
          {sets && sets.length > 0 ? (
            sets.map((set, index) => (
              <Set
                key={set.id}
                set={set}
                index={index}
                setNewWorkout={setNewWorkout}
                exerciseInstance={exerciseInstance}
              />
            ))
          ) : (
            <p className='font-medium text-muted-foreground'>No sets created</p>
          )}
          <Button variant='ghost' className='max-w-max' onClick={addSet}>
            Add Set
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface SetProps {
  set: Database['public']['Tables']['workout_sets']['Row'];
  index: number;
  setNewWorkout: Dispatch<SetStateAction<Workout>>;
  exerciseInstance: Database['public']['Tables']['workout_exercises']['Row'];
}

function Set({ set, index, setNewWorkout, exerciseInstance }: SetProps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const targetReps = useMemo(() => set.reps, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const targetWeight = useMemo(() => set.weight, []);

  function updateSetReps(reps: number, id: string) {
    setNewWorkout((prev) => ({
      ...prev,
      workout_exercises: prev.workout_exercises.map((exercise) => {
        if (exercise.id === exerciseInstance.id) {
          return {
            ...exercise,
            workout_sets: exercise.workout_sets.map((set) => {
              if (set.id === id) {
                return {
                  ...set,
                  reps,
                };
              }

              return set;
            }),
          };
        }

        return exercise;
      }),
    }));
  }

  function updateSetWeight(weight: number, id: string) {
    setNewWorkout((prev) => ({
      ...prev,
      workout_exercises: prev.workout_exercises.map((exercise) => {
        if (exercise.id === exerciseInstance.id) {
          return {
            ...exercise,
            workout_sets: exercise.workout_sets.map((set) => {
              if (set.id === id) {
                return {
                  ...set,
                  weight,
                };
              }

              return set;
            }),
          };
        }

        return exercise;
      }),
    }));
  }

  function removeSet(id: string) {
    setNewWorkout((prev) => ({
      ...prev,
      workout_exercises: prev.workout_exercises.map((exercise) => {
        if (exercise.id === exerciseInstance.id) {
          return {
            ...exercise,
            workout_sets: exercise.workout_sets.filter((set) => set.id !== id),
          };
        }

        return exercise;
      }),
    }));
  }

  return (
    <div>
      <p className='font-semibold mb-1'>Set {index + 1}</p>
      <div className='flex gap-1'>
        <Input
          type='number'
          placeholder={`Target: ${targetReps}`}
          min={0}
          onChange={(e) => {
            e.preventDefault();

            if (e.target.value) {
              updateSetReps(parseInt(e.target.value), set.id);
            }
          }}
          autoFocus
        />
        <Input
          type='number'
          placeholder={`Target: ${targetWeight}(kg)`}
          min={0}
          step={0.5}
          onChange={(e) => {
            e.preventDefault();

            if (e.target.value) {
              updateSetWeight(parseInt(e.target.value), set.id);
            }
          }}
        />
        <Button
          variant='ghost'
          className='max-w-max p-2'
          type='button'
          onClick={() => removeSet(set.id)}
        >
          <XIcon className='w-3 h-3' />
        </Button>
      </div>
    </div>
  );
}
