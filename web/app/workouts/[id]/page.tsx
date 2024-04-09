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

export default async function Workout({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: workout, error: workoutError } = await supabase
    .from('workouts')
    .select('*, workout_exercises(*, workout_sets(*), exercise(*))')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (!workout) {
    redirect('/workouts');
  }

  return (
    <div className='flex flex-1 flex-col gap-4 md:gap-8'>
      <div className='grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3'>
        <Card className='xl:col-span-2'>
          <CardHeader className='flex flex-col gap-1 xs:flex-row xs:items-end xs:justify-between'>
            <div className='grid gap-2'>
              <CardTitle>{workout.name}</CardTitle>
              <CardDescription>View the workout details</CardDescription>
            </div>
            <Button asChild size='sm' className='gap-1 max-w-max'>
              <Link href={`/workouts/${workout.id}/record`}>
                Record Workout
                <ArrowUpRight className='h-4 w-4' />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exercise</TableHead>
                  <TableHead>Sets</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workout.workout_exercises.map((exercise) => (
                  <TableRow key={exercise.id}>
                    <TableCell>
                      <p>{exercise.exercise?.name}</p>
                      <div className='flex gap-2 text-muted-foreground'>
                        <span>{exercise.exercise?.equipment_needed}</span>
                        <span className='flex items-center justify-center'>
                          <span className='bg-slate-300 w-[3px] h-[3px] rounded-full'></span>
                        </span>
                        <span>{exercise.exercise?.muscle_group}</span>
                      </div>
                    </TableCell>
                    <TableCell>{exercise.workout_sets.length}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            type='button'
                            variant='outline'
                            className='block ml-auto'
                          >
                            View Sets
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{exercise.exercise?.name}</DialogTitle>
                            <DialogDescription>
                              <div className='flex gap-2 text-muted-foreground mb-2'>
                                <span>
                                  {exercise.exercise?.equipment_needed}
                                </span>
                                <span className='flex items-center justify-center'>
                                  <span className='bg-slate-300 w-[3px] h-[3px] rounded-full'></span>
                                </span>
                                <span>{exercise.exercise?.muscle_group}</span>
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                          <div className='flex flex-col gap-4'>
                            {exercise.workout_sets.map((set, index) => (
                              <div key={set.id}>
                                <h3 className='font-semibold text-sm'>
                                  Set {index + 1}
                                </h3>
                                <div className='flex gap-1'>
                                  <div className='flex-1'>
                                    <span className='text-muted-foreground font-medium text-xs'>
                                      Reps
                                    </span>
                                    <Input disabled value={set.reps || 0} />
                                  </div>
                                  <div className='flex-1'>
                                    <span className='text-muted-foreground font-medium text-xs'>
                                      Weight
                                    </span>
                                    <Input disabled value={set.weight || 0} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <DialogFooter className='sm:justify-start'>
                            <DialogClose asChild>
                              <Button type='button' variant='secondary'>
                                Close
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-col gap-1 xs:flex-row xs:items-end xs:justify-between'>
            <div className='grid gap-2'>
              <CardTitle>Workout History</CardTitle>
              <CardDescription>This workout&apos;s history</CardDescription>
            </div>
          </CardHeader>
          <CardContent className='grid gap-8'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Weight Lifted</TableHead>
                  <TableHead className='text-right'>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className='font-medium'>Upper body</div>
                  </TableCell>
                  <TableCell>240kg</TableCell>
                  <TableCell className='text-right'>2023-06-23</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
