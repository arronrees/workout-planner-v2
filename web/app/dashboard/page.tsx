import Link from 'next/link';
import { Activity, ArrowUpRight, Clock, Dumbbell, Weight } from 'lucide-react';
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
import DashboardHeader from '@/components/blocks/dashboard/DashboardHeader';

export default async function Dashboard() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: workouts } = await supabase
    .from('workout_instance')
    .select(
      '*, workout_exercise_instance(*, workout_set_instance(*), exercise(*))'
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className='flex flex-1 flex-col gap-4 md:gap-6'>
      <DashboardHeader user={user} />
      <div className='grid gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3'>
        <Card className='xl:col-span-2'>
          <CardHeader className='flex flex-row items-center'>
            <div className='grid gap-2'>
              <CardTitle>Workout History</CardTitle>
              <CardDescription>Recent workouts completed</CardDescription>
            </div>
            <Button asChild size='sm' className='ml-auto gap-1'>
              <Link href='/workouts'>
                View All
                <ArrowUpRight className='h-4 w-4' />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Weight Lifted</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workouts &&
                  workouts.map((workout) => (
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

                            curr.workout_set_instance.forEach((set) => {
                              val += (set.weight ?? 0) * (set.reps ?? 1);
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
        <Card>
          <CardHeader>
            <CardTitle>Favourite Exercises</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-6'>
            <div className='flex items-center gap-4'>
              <div className='grid gap-1'>
                <p className='text-sm font-medium leading-none'>
                  Barbell Back Squat
                </p>
                <p className='text-sm text-muted-foreground'>8 in past week</p>
              </div>
              <div className='ml-auto font-medium'>75kg</div>
            </div>
            <div className='flex items-center gap-4'>
              <div className='grid gap-1'>
                <p className='text-sm font-medium leading-none'>Bench Press</p>
                <p className='text-sm text-muted-foreground'>8 in past week</p>
              </div>
              <div className='ml-auto font-medium'>75kg</div>
            </div>
            <div className='flex items-center gap-4'>
              <div className='grid gap-1'>
                <p className='text-sm font-medium leading-none'>
                  Military Press
                </p>
                <p className='text-sm text-muted-foreground'>8 in past week</p>
              </div>
              <div className='ml-auto font-medium'>75kg</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
