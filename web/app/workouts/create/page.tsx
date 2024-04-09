import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import CreateWorkoutForm from '@/components/blocks/workouts/create/CreateWorkoutForm';

export default async function CreateWorkout() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  return (
    <Card className='max-w-lg mx-auto'>
      <CardHeader>
        <CardTitle>Create your workout</CardTitle>
        <CardDescription>
          Add your excerises and create your workout
        </CardDescription>
      </CardHeader>

      <CardContent>
        <CreateWorkoutForm />
      </CardContent>
    </Card>
  );
}
