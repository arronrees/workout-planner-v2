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
  );
}
