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
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Exercises({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: exercise } = await supabase
    .from('exercise')
    .select('name, id')
    .eq('id', params.id)
    .single();

  if (!exercise) {
    return redirect('/exercises');
  }

  const { data: instances } = await supabase
    .from('workout_exercise_instance')
    .select('id, created_at, workout_set_instance(reps, weight)')
    .eq('exercise_id', params.id)
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
            <BreadcrumbLink href='/exercises'>Exercises</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{exercise.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <Card>
          <CardHeader className='flex flex-col gap-1 xs:flex-row xs:items-end xs:justify-between'>
            <div className='grid gap-2'>
              <CardTitle>{exercise.name}</CardTitle>
              <CardDescription>
                View the progression of this exercise
              </CardDescription>
            </div>
            <Button asChild size='sm' variant='secondary'>
              <Link href='/exercises'>Back To Exercises</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reps</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>% vs previous</TableHead>
                  <TableHead>% vs start</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instances &&
                  instances.map((instance, index) => {
                    const reps: number = instance.workout_set_instance.reduce(
                      (arr, curr: any) => {
                        return arr + (curr.reps ?? 0);
                      },
                      0
                    );

                    const weight: number = instance.workout_set_instance.reduce(
                      (arr, curr: any) => {
                        return arr + (curr.weight ?? 0);
                      },
                      0
                    );

                    let weightLastWeek: number = 0;

                    if (!(index + 1 >= instances.length)) {
                      weightLastWeek = instances[
                        index + 1
                      ]?.workout_set_instance.reduce((arr, curr: any) => {
                        return arr + (curr.weight ?? 0);
                      }, 0);
                    }

                    let percentageLastChange: number = 0;
                    let percentageLastToDisplay: string | number = '';
                    let percentageLastClass: string = '';

                    if (weightLastWeek && weight) {
                      percentageLastChange =
                        ((weight - weightLastWeek) / weightLastWeek) * 100;

                      percentageLastToDisplay =
                        percentageLastChange === 0
                          ? 0
                          : parseInt(percentageLastChange.toString())
                          ? percentageLastChange.toFixed(2)
                          : '';

                      percentageLastClass =
                        percentageLastChange === 0
                          ? 'text-orange-500'
                          : percentageLastChange > 0
                          ? 'text-green-500'
                          : 'text-red-500';
                    }

                    // start week
                    let weightStartWeek: number = instances[
                      instances.length - 1
                    ]?.workout_set_instance.reduce((arr, curr: any) => {
                      return arr + (curr.weight ?? 0);
                    }, 0);

                    let percentageStartChange: number = 0;
                    let percentageStartToDisplay: string | number = '';
                    let percentageStartClass: string = '';

                    if (weightStartWeek && weight) {
                      percentageStartChange =
                        ((weight - weightStartWeek) / weightStartWeek) * 100;

                      percentageStartToDisplay =
                        percentageStartChange === 0
                          ? 0
                          : parseInt(percentageStartChange.toString())
                          ? percentageStartChange.toFixed(2)
                          : '';

                      percentageStartClass =
                        percentageStartChange === 0
                          ? 'text-orange-500'
                          : percentageStartChange > 0
                          ? 'text-green-500'
                          : 'text-red-500';
                    }

                    return (
                      <TableRow key={instance.id}>
                        <TableCell>
                          {new Date(instance.created_at).toDateString()}
                        </TableCell>
                        <TableCell>{reps}</TableCell>
                        <TableCell className='font-medium'>
                          {weight}
                          kg
                        </TableCell>
                        <TableCell className={percentageLastClass}>
                          {percentageLastToDisplay ||
                          percentageLastToDisplay === 0
                            ? percentageLastToDisplay + '%'
                            : ''}
                        </TableCell>
                        <TableCell className={percentageStartClass}>
                          {percentageStartToDisplay ||
                          percentageStartToDisplay === 0
                            ? percentageStartToDisplay + '%'
                            : ''}
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
