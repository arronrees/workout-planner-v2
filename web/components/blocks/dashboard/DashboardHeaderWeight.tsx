'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { Weight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from '@supabase/supabase-js';

export default function DashboardHeaderWeight({ user }: { user: User }) {
  const supabase = createClient();

  const [totalWeightLifted, setTotalWeightLifted] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchTotalWeightLifted() {
      setIsLoading(true);

      const { data: sets } = await supabase
        .from('workout_set_instance')
        .select('reps, weight')
        .gte('weight', 0)
        .gte('reps', 0)
        .eq('user_id', user.id);

      setIsLoading(false);

      if (sets) {
        setTotalWeightLifted(
          sets.reduce((acc: number, curr: any) => {
            return acc + (curr.reps ?? 1) * (curr.weight ?? 0);
          }, 0)
        );
      }
    }

    fetchTotalWeightLifted();
  }, [supabase, user]);

  if (isLoading) {
    return <Skeleton className='h-28 bg-slate-200' />;
  }

  if (!totalWeightLifted) {
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
          {new Intl.NumberFormat('en-gb', {}).format(totalWeightLifted)} kg
        </div>
      </CardContent>
    </Card>
  );
}
