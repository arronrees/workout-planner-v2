'use client';

import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Dispatch, SetStateAction, useState } from 'react';
import { muscleGroups } from '@/constants';
import { Exercise, NewWorkout } from './CreateWorkoutForm';
import randomstring from 'randomstring';

interface Props {
  exercises: Exercise[];
  setExercises: Dispatch<SetStateAction<Exercise[] | null>>;
  setNewWorkout: Dispatch<SetStateAction<NewWorkout>>;
}

export function ExerciseCombobox({
  exercises,
  setExercises,
  setNewWorkout,
}: Props) {
  const [open, setOpen] = useState(false);

  function addExercise(exercise: Exercise) {
    setNewWorkout((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          id: randomstring.generate(),
          sets: [],
          exercise,
          sortOrder: (() => {
            if (prev.exercises && prev.exercises.length > 0) {
              return prev.exercises[prev.exercises.length - 1].sortOrder + 1;
            }

            return 0;
          })(),
        },
      ],
    }));
  }

  function removeFromExerciseList(id: string) {
    setExercises(exercises.filter((exercise) => exercise.id !== id));
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='justify-between'
        >
          Select exercises...
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0'>
        <Command>
          <CommandInput placeholder='Search exercises...' />
          <CommandEmpty>No exercises found.</CommandEmpty>
          <CommandList>
            {muscleGroups.map((group) => (
              <CommandGroup heading={group} key={group}>
                {exercises &&
                  exercises
                    .filter((exercise) => exercise.muscle_group === group)
                    .map((exercise) => (
                      <CommandItem
                        key={exercise.id}
                        value={exercise.name}
                        onSelect={(currentValue) => {
                          addExercise(exercise);
                          removeFromExerciseList(exercise.id);
                        }}
                      >
                        {exercise.name}
                      </CommandItem>
                    ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
