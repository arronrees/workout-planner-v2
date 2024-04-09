import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Fragment } from 'react';

export default async function Workout({
  params,
}: {
  params: { id: string; instanceId: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: workout } = await supabase
    .from('workout_instance')
    .select(
      '*, workout_exercise_instance(*, workout_set_instance(*), exercise(*))'
    )
    .eq('user_id', user.id)
    .eq('id', params.instanceId)
    .single();

  if (!workout) {
    redirect('/workouts');
  }

  console.log(workout);

  return (
    <div className='flex flex-1 flex-col gap-4 md:gap-8'>
      <Card className='xl:col-span-2'>
        <CardHeader className='flex flex-col gap-1 xs:flex-row xs:items-end xs:justify-between'>
          <div className='grid gap-2'>
            <CardTitle>{workout.name}</CardTitle>
            <CardDescription>View the workout details</CardDescription>
          </div>
          <Button asChild size='sm' variant='secondary'>
            <Link href={`/workouts/${workout.id}`}>Back To Workout</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exercise</TableHead>
                <TableHead>Set</TableHead>
                <TableHead>Reps</TableHead>
                <TableHead>Weight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workout.workout_exercise_instance.map((exercise) => (
                <Fragment key={exercise.id}>
                  {exercise.workout_set_instance.map((set, index) => (
                    <TableRow
                      key={set.id}
                      className={
                        index === exercise.workout_set_instance.length - 1
                          ? 'border-b-4 border-slate-200'
                          : 'border-slate-100'
                      }
                    >
                      <TableCell className='font-medium'>
                        {index === 0 && exercise.exercise?.name}
                      </TableCell>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{set.reps}</TableCell>
                      <TableCell className='font-medium'>
                        {set.weight}kg
                      </TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
