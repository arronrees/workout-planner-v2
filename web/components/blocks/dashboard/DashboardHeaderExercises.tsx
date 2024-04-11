'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { Dumbbell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from '@supabase/supabase-js';

export default function DashboardHeaderExercises({ user }: { user: User }) {
  const supabase = createClient();

  const [totalSets, setTotalSets] = useState<number | null>(null);

  useEffect(() => {
    async function fetchTotalSets() {
      const { count } = await supabase
        .from('workout_set_instance')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);

      if (count) {
        setTotalSets(count);
      }
    }

    fetchTotalSets();
  }, [supabase, user]);

  if (!totalSets) {
    return <Skeleton className='h-28 bg-slate-200' />;
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>Sets Performed</CardTitle>
        <Dumbbell className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>
          {new Intl.NumberFormat('en-gb', {}).format(totalSets)}
        </div>
      </CardContent>
    </Card>
  );
}
