import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { Dumbbell } from 'lucide-react';
import { User } from '@supabase/supabase-js';

export default async function DashboardHeaderExercises({
  user,
}: {
  user: User;
}) {
  const supabase = createClient();

  const { count } = await supabase
    .from('workout_set_instance')
    .select('', { count: 'exact' })
    .eq('user_id', user.id);

  if (!count) {
    return null;
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>Sets Performed</CardTitle>
        <Dumbbell className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>
          {new Intl.NumberFormat('en-gb', {}).format(count)}
        </div>
      </CardContent>
    </Card>
  );
}
