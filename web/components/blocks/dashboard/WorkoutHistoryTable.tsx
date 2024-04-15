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
import { Database } from '@/database.types';
import { createClient } from '@/utils/supabase/server';
import { User } from '@supabase/supabase-js';

interface Props {
  user: User;
}

export default async function WorkoutHistoryTable({ user }: Props) {
  const supabase = createClient();

  const { data: workouts } = await supabase
    .from('workout_instance')
    .select(
      '*, workout_exercise_instance(*, workout_set_instance(*), exercise(*))'
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  if (!workouts || workouts.length === 0) {
    return <p className='font-medium text-lg'>No workouts completed yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Weight Lifted</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workouts.map((workout) => (
          <TableRow key={workout.id}>
            <TableCell>
              <div>
                <span className='font-medium'>
                  {new Date(workout.created_at).toDateString()} -{' '}
                </span>
                {workout.name}
              </div>
            </TableCell>
            <TableCell>
              {workout.workout_exercise_instance.reduce(
                (acc: number, curr: any) => {
                  let val = 0;

                  curr.workout_set_instance.forEach(
                    (
                      set: Database['public']['Tables']['workout_set_instance']['Row']
                    ) => {
                      val += (set.weight ?? 0) * (set.reps ?? 1);
                    }
                  );

                  return acc + val;
                },
                0
              )}
              kg
            </TableCell>
            <TableCell className='text-right'>
              <div className='flex items-center justify-end'>
                <Button variant='outline' className='block ml-auto' asChild>
                  <Link
                    href={`/workouts/${workout.workout_id}/history/${workout.id}`}
                  >
                    View
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
