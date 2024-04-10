'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ExerciseCombobox } from '@/components/blocks/workouts/create/ExerciseCombobox';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { equipmentTypes } from '@/constants';
import { Badge } from '@/components/ui/badge';
import { XIcon } from 'lucide-react';
import { Exercise, NewWorkout } from './CreateWorkoutForm';

interface Props {
  exercises: Exercise[] | null;
  setExercises: Dispatch<SetStateAction<Exercise[] | null>>;
  allExercises: Exercise[] | null;
  newWorkout: NewWorkout;
  setNewWorkout: Dispatch<SetStateAction<NewWorkout>>;
}

export default function Stage1({
  exercises,
  setExercises,
  allExercises,
  newWorkout,
  setNewWorkout,
}: Props) {
  function removeSelectedExercise(id: string, sortOrder: number) {
    setNewWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises
        .filter((exerciseInstance) => exerciseInstance.exercise.id !== id)
        .map((exerciseInstance) =>
          exerciseInstance.sortOrder > sortOrder
            ? { ...exerciseInstance, sortOrder: exerciseInstance.sortOrder - 1 }
            : exerciseInstance
        ),
    }));
  }

  function reSortExercises(id: string) {
    if (allExercises) {
      setExercises(
        allExercises.filter((exercise) => {
          const isSelected = newWorkout.exercises.some(
            (selected) => selected.exercise.id === exercise.id
          );

          if (isSelected && exercise.id === id) {
            return true;
          }

          return !isSelected;
        })
      );
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='name'>Workout Name:</Label>
        <Input
          type='text'
          name='name'
          placeholder='Workout Name'
          onChange={(e) => {
            setNewWorkout({ ...newWorkout, name: e.target.value });
          }}
          value={newWorkout.name}
          required
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='equipment'>Equipment Needed:</Label>
        <Select
          name='equipment'
          value={newWorkout.equipment}
          onValueChange={(value) => {
            setNewWorkout({ ...newWorkout, equipment: value });
          }}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder='Equipment Needed' />
          </SelectTrigger>
          <SelectContent>
            {equipmentTypes.map((type) => (
              <SelectItem value={type} key={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex flex-col gap-2'>
        <Label htmlFor='exercises'>Exercises:</Label>
        {exercises && (
          <ExerciseCombobox
            setNewWorkout={setNewWorkout}
            exercises={exercises}
            setExercises={setExercises}
          />
        )}
        <ul className='flex flex-wrap text-xs gap-2'>
          {newWorkout.exercises &&
            newWorkout.exercises
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((exerciseInstance) => (
                <li key={exerciseInstance.id}>
                  <Badge
                    variant='secondary'
                    className='flex gap-1 hover:bg-gray-200 cursor-pointer'
                    onClick={(e) => {
                      e.preventDefault();

                      removeSelectedExercise(
                        exerciseInstance.exercise.id,
                        exerciseInstance.sortOrder
                      );
                      reSortExercises(exerciseInstance.exercise.id);
                    }}
                  >
                    {exerciseInstance.exercise.name}
                    <XIcon className='w-3 h-3' />
                  </Badge>
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
}
