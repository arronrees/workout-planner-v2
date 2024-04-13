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
import ExercisePB from '@/components/blocks/exercises/ExercisePB';

export default async function Exercises() {
  const supabase = createClient();

  const {
    data: { user },
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
              <CardDescription>
                Here shows the progress of all the exercises you have performed
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Weight this week</TableHead>
                  <TableHead>% vs previous week</TableHead>
                  <TableHead>PB</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allExercises &&
                  allExercises.map((exercise) => {
                    const thisWeekWeight: number =
                      exercisesThisWeek
                        ?.find((e) => e.id === exercise.id)
                        ?.workout_exercise_instance.reduce(
                          (acc: number, curr: any) => {
                            return (
                              acc +
                              curr.workout_set_instance.reduce(
                                (nacc: number, ncurr: any) => {
                                  return nacc + (ncurr.weight ?? 0);
                                },
                                0
                              )
                            );
                          },
                          0
                        ) ?? 0;

                    const lastWeekWeight: number =
                      exercisesLastWeek
                        ?.find((e) => e.id === exercise.id)
                        ?.workout_exercise_instance.reduce(
                          (acc: number, curr: any) => {
                            return (
                              acc +
                              curr.workout_set_instance.reduce(
                                (nacc: number, ncurr: any) => {
                                  return nacc + (ncurr.weight ?? 0);
                                },
                                0
                              )
                            );
                          },
                          0
                        ) ?? 0;

                    const percentageChange: number =
                      ((thisWeekWeight - lastWeekWeight) / lastWeekWeight) *
                      100;

                    const percentageToDisplay: string | number =
                      percentageChange === 0
                        ? 0
                        : parseInt(percentageChange.toString())
                        ? percentageChange.toFixed(2)
                        : '';

                    const percentageClass: string =
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
                        <TableCell className='font-medium'>
                          {thisWeekWeight}kg
                          <span className='text-muted-foreground text-xs ml-2'>
                            ({lastWeekWeight}kg)
                          </span>
                        </TableCell>
                        <TableCell className={percentageClass}>
                          {percentageToDisplay || percentageToDisplay === 0
                            ? percentageToDisplay + '%'
                            : ''}
                        </TableCell>
                        <TableCell>
                          <ExercisePB id={exercise.id} user={user} />
                        </TableCell>
                        <TableCell className='text-right'>
                          <div className='flex items-center justify-end'>
                            <Button
                              variant='outline'
                              className='block ml-auto'
                              asChild
                            >
                              <Link href={`/exercises/${exercise.id}`}>
                                View
                              </Link>
                            </Button>
                          </div>
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
