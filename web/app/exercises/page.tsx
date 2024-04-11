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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default async function Exercises() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day == 0 ? -6 : 1);
  const thisWeekStart = new Date(today.setDate(diff));
  thisWeekStart.setHours(0, 0, 0, 0);

  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);

  const lastWeekEnd = new Date(thisWeekStart);
  lastWeekEnd.setDate(thisWeekStart.getDate() - 1);

  const { data: allExercises } = await supabase
    .from('exercise')
    .select('name, id, workout_exercise_instance(id)')
    .filter('workout_exercise_instance', 'not.is', null);

  const { data: exercisesThisWeek } = await supabase
    .from('exercise')
    .select('name, id, workout_exercise_instance(id, workout_set_instance(*))')
    .filter('workout_exercise_instance', 'not.is', null)
    .gt('workout_exercise_instance.created_at', thisWeekStart.toISOString());

  const { data: exercisesLastWeek } = await supabase
    .from('exercise')
    .select('name, id, workout_exercise_instance(id, workout_set_instance(*))')
    .filter('workout_exercise_instance', 'not.is', null)
    .gt('workout_exercise_instance.created_at', lastWeekStart.toISOString())
    .lt('workout_exercise_instance.created_at', lastWeekEnd.toISOString());

  return (
    <div className='flex flex-1 flex-col gap-4 md:gap-6'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/dashboard'>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Exercises</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <Card>
          <CardHeader className='flex flex-row items-center'>
            <div className='grid gap-2'>
              <CardTitle>Exercises</CardTitle>
              <CardDescription>View a list of your workouts</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>
                    <span className='flex flex-col gap-1'>
                      <span>Reps</span>
                      <span>This week</span>
                    </span>
                  </TableHead>
                  <TableHead>
                    <span className='flex flex-col gap-1'>
                      <span>Weight</span>
                      <span>This week</span>
                    </span>
                  </TableHead>
                  <TableHead>
                    <span className='flex flex-col gap-1'>
                      <span>Reps</span>
                      <span>Last week</span>
                    </span>
                  </TableHead>
                  <TableHead>
                    <span className='flex flex-col gap-1'>
                      <span>Weight</span>
                      <span>Last week</span>
                    </span>
                  </TableHead>
                  <TableHead>%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allExercises &&
                  allExercises.map((exercise) => {
                    const thisWeekReps =
                      exercisesThisWeek
                        ?.find((e) => e.id === exercise.id)
                        ?.workout_exercise_instance.reduce((acc, curr) => {
                          return (
                            acc +
                            curr.workout_set_instance.reduce((nacc, ncurr) => {
                              return nacc + (ncurr.reps ?? 0);
                            }, 0)
                          );
                        }, 0) ?? 0;
                    const thisWeekWeight =
                      exercisesThisWeek
                        ?.find((e) => e.id === exercise.id)
                        ?.workout_exercise_instance.reduce((acc, curr) => {
                          return (
                            acc +
                            curr.workout_set_instance.reduce((nacc, ncurr) => {
                              return nacc + (ncurr.weight ?? 0);
                            }, 0)
                          );
                        }, 0) ?? 0;
                    const lastWeekReps =
                      exercisesLastWeek
                        ?.find((e) => e.id === exercise.id)
                        ?.workout_exercise_instance.reduce((acc, curr) => {
                          return (
                            acc +
                            curr.workout_set_instance.reduce((nacc, ncurr) => {
                              return nacc + (ncurr.reps ?? 0);
                            }, 0)
                          );
                        }, 0) ?? 0;
                    const lastWeekWeight =
                      exercisesLastWeek
                        ?.find((e) => e.id === exercise.id)
                        ?.workout_exercise_instance.reduce((acc, curr) => {
                          return (
                            acc +
                            curr.workout_set_instance.reduce((nacc, ncurr) => {
                              return nacc + (ncurr.weight ?? 0);
                            }, 0)
                          );
                        }, 0) ?? 0;

                    const percentageChange =
                      ((thisWeekWeight - lastWeekWeight) / lastWeekWeight) *
                      100;

                    const percentageToDisplay =
                      percentageChange === 0
                        ? 0
                        : !!parseInt(percentageChange.toString())
                        ? percentageChange.toFixed(2)
                        : '';

                    const percentageClass =
                      percentageChange === 0
                        ? 'text-orange-500'
                        : percentageChange > 0
                        ? 'text-green-500'
                        : 'text-red-500';

                    return (
                      <TableRow key={exercise.id}>
                        <TableCell>
                          <div className='font-medium'>{exercise.name}</div>
                        </TableCell>
                        <TableCell>{thisWeekReps}</TableCell>
                        <TableCell className='font-medium'>
                          {thisWeekWeight}
                          kg
                        </TableCell>
                        <TableCell className='text-muted-foreground'>
                          {lastWeekReps}
                        </TableCell>
                        <TableCell className='font-medium text-muted-foreground'>
                          {lastWeekWeight}
                          kg
                        </TableCell>
                        <TableCell className={percentageClass}>
                          {percentageToDisplay}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
