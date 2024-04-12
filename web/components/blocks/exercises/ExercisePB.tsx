'use client';

import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export default function ExercisePB({ id, user }: { id: string; user: User }) {
  const supabase = createClient();

  const [pb, setPb] = useState<number | null>(null);

  useEffect(() => {
    async function fetchPB() {
      if (id) {
        const { data } = await supabase
          .from('workout_set_instance')
          .select('*, workout_exercise_instance(exercise_id)')
          .filter('workout_exercise_instance', 'not.is', null)
          .eq('user_id', user.id)
          .eq('workout_exercise_instance.exercise_id', id)
          .order('weight', { ascending: false })
          .limit(1)
          .single();

        if (data) {
          setPb(data.weight);
        }
      }
    }

    fetchPB();
  }, [supabase, id, user]);

  if (!pb) {
    return null;
  }

  return <span className='font-medium'>{pb}kg</span>;
}
