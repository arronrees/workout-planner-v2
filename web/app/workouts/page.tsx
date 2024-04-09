import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function Workouts() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: workouts, error: workoutError } = await supabase
    .from('workouts')
    .select('*, workout_exercises(id)')
    .eq('user_id', user.id)
    .limit(8);

  const { data: workoutHistory } = await supabase
    .from('workout_instance')
    .select(
      '*, workout_exercise_instance(*, workout_set_instance(*), exercise(*))'
    )
    .eq('user_id', user.id)
    .limit(20);

  return (
    <div className='flex flex-1 flex-col gap-4 md:gap-8'>
      <div className='grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3'>
        <Card className='xl:col-span-2'>
          <CardHeader className='flex flex-row items-center'>
            <div className='grid gap-2'>
              <CardTitle>Workouts</CardTitle>
              <CardDescription>View a list of your workouts</CardDescription>
            </div>
            <Button asChild size='sm' className='ml-auto gap-1'>
              <Link href='/workouts/create'>
                Create Workout
                <ArrowUpRight className='h-4 w-4' />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Equipment Needed</TableHead>
                  <TableHead>Muscle Focus</TableHead>
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
                      <TableCell>{workout.muscle_focus}</TableCell>
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Workout History</CardTitle>
            <CardDescription>Recent workouts completed</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-8'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Weight Lifted</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workoutHistory &&
                  workoutHistory.map((workout) => (
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
                          (acc, curr) => {
                            let val = 0;

                            curr.workout_set_instance.forEach((set) => {
                              val += set.weight || 0 * (set.reps || 1);
                            });

                            return acc + val;
                          },
                          0
                        )}
                        kg
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end'>
                          <Button
                            variant='outline'
                            className='block ml-auto'
                            asChild
                          >
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
