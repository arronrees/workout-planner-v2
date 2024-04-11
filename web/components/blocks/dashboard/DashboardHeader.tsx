import DashboardHeaderWeight from './DashboardHeaderWeight';
import { User } from '@supabase/supabase-js';
import DashboardHeaderWorkouts from './DashboardHeaderWorkouts';
import DashboardHeaderExercises from './DashboardHeaderExercises';

export default function DashboardHeader({ user }: { user: User }) {
  return (
    <div className='grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3'>
      <DashboardHeaderWeight user={user} />
      <DashboardHeaderWorkouts user={user} />
      <DashboardHeaderExercises user={user} />
    </div>
  );
}
