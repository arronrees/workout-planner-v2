import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { Weight } from 'lucide-react';
import { User } from '@supabase/supabase-js';

export default async function DashboardHeaderWeight({ user }: { user: User }) {
  const supabase = createClient();

  const { data: sets } = await supabase
    .from('workout_set_instance')
    .select('reps, weight')
    .gte('weight', 0)
    .gte('reps', 0)
    .eq('user_id', user.id);

  if (!sets) {
    return null;
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>
          Total Volume Lifted
        </CardTitle>
        <Weight className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>
          {new Intl.NumberFormat('en-gb', {}).format(
            sets.reduce((acc: number, curr: any) => {
              return acc + (curr.reps ?? 1) * (curr.weight ?? 0);
            }, 0)
          )}
          kg
        </div>
      </CardContent>
    </Card>
  );
}
