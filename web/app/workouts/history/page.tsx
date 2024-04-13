import Link from 'next/link';
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Database } from '@/database.types';

export default async function Workouts() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: workoutHistory } = await supabase
    .from('workout_instance')
    .select(
      '*, workout_exercise_instance(*, workout_set_instance(*), exercise(*))'
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className='flex flex-1 flex-col gap-4 md:gap-6'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/dashboard'>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href='/workouts'>Workouts</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Workout History</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Workout History</CardTitle>
          <CardDescription>Recent workouts completed</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-6'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Weight Lifted</TableHead>
                <TableHead>Exercises</TableHead>
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
                    <TableCell>
                      {workout.workout_exercise_instance.length}
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
  );
}
