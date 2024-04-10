import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import RecordWorkoutForm from '@/components/blocks/workouts/update/RecordWorkoutForm';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

export default async function RecordWorkout({
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
    <div className='flex flex-1 flex-col gap-4 md:gap-6 max-w-lg mx-auto'>
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
            <BreadcrumbLink href={`/workouts/${workout.id}`}>
              {workout.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Record Workout</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className='max-w-lg mx-auto'>
        <CardHeader>
          <CardTitle>Record your workout</CardTitle>
          <CardDescription>
            Record your workout to track your progress
          </CardDescription>
        </CardHeader>

        <CardContent>
          {workout && <RecordWorkoutForm workout={workout} />}
        </CardContent>
      </Card>
    </div>
  );
}
