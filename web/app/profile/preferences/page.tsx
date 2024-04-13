import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import PreferencesForm from '@/components/blocks/settings/PreferencesForm';

export default async function Preferences() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: preferences } = await supabase
    .from('user_preferences')
    .select()
    .eq('user_id', user?.id)
    .single();

  return (
    <div className='grid gap-6'>
      <PreferencesForm preferences={preferences} />
    </div>
  );
}
