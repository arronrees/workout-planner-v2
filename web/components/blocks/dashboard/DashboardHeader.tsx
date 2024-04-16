import DashboardHeaderWeight from './DashboardHeaderWeight';
import { User } from '@supabase/supabase-js';
import DashboardHeaderWorkouts from './DashboardHeaderWorkouts';
import DashboardHeaderExercises from './DashboardHeaderExercises';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardHeader({ user }: { user: User }) {
  return (
    <div className='grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3'>
      <Suspense fallback={<Skeleton className='h-28 bg-slate-200' />}>
        <DashboardHeaderWeight user={user} />
      </Suspense>
      <Suspense fallback={<Skeleton className='h-28 bg-slate-200' />}>
        <DashboardHeaderWorkouts user={user} />
        <Suspense
          fallback={<Skeleton className='h-28 bg-slate-200' />}
        ></Suspense>
        <DashboardHeaderExercises user={user} />
      </Suspense>
    </div>
  );
}
