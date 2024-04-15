import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { User } from '@supabase/supabase-js';
import { ArrowRight } from 'lucide-react';

interface Props {
  user: User;
}

export default async function WorkoutTable({ user }: Props) {
  const supabase = createClient();

  const { data: workouts } = await supabase
    .from('workouts')
    .select('*, workout_exercises(id)')
    .eq('user_id', user.id)
    .limit(8);

  if (!workouts || workouts.length < 0) {
    return <p className='font-medium text-lg'>No workouts created yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Equipment Needed</TableHead>
          <TableHead>No. of Exercises</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workouts &&
          workouts.map((workout) => (
            <TableRow key={workout.id}>
              <TableCell>
                <div className='font-medium'>{workout.name}</div>
              </TableCell>
              <TableCell>{workout.equipment_needed}</TableCell>
              <TableCell>{workout.workout_exercises.length}</TableCell>
              <TableCell>
                <div className='flex items-center justify-end'>
                  <Button asChild variant='outline'>
                    <Link
                      href={`/workouts/${workout.id}`}
                      className='flex gap-1'
                    >
                      View
                      <ArrowRight className='h-3 w-3' />
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
