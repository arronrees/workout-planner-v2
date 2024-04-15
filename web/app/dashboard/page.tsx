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
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import DashboardHeader from '@/components/blocks/dashboard/DashboardHeader';
import WorkoutHistoryTable from '@/components/blocks/dashboard/WorkoutHistoryTable';
import WorkoutTable from '@/components/blocks/dashboard/WorkoutTable';
import FavouriteExercises from '@/components/blocks/dashboard/FavouriteExercises';

export default async function Dashboard() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  return (
    <div className='flex flex-1 flex-col gap-4 md:gap-6'>
      <DashboardHeader user={user} />
      <div className='grid gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3'>
        <Card className='xl:col-span-2'>
          <CardHeader className='flex flex-row items-center'>
            <div className='grid gap-2'>
              <CardTitle>My Workouts</CardTitle>
              <CardDescription>List of created workouts</CardDescription>
            </div>
            <Button asChild size='sm' className='ml-auto gap-1'>
              <Link href='/workouts'>
                Workouts
                <ArrowUpRight className='h-4 w-4' />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <WorkoutTable user={user} />
          </CardContent>
        </Card>
        <Card className='xl:col-span-2 xl:order-2'>
          <CardHeader className='flex flex-row items-center'>
            <div className='grid gap-2'>
              <CardTitle>Workout History</CardTitle>
              <CardDescription>Recent workouts completed</CardDescription>
            </div>
            <Button asChild size='sm' className='ml-auto gap-1'>
              <Link href='/workouts/history'>
                History
                <ArrowUpRight className='h-4 w-4' />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <WorkoutHistoryTable user={user} />
          </CardContent>
        </Card>
        <Card className='xl:order-1'>
          <CardHeader>
            <CardTitle>Favourite Exercises</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-6'>
            <FavouriteExercises user={user} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
