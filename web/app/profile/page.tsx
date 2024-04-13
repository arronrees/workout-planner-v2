import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import UserForm from '@/components/blocks/settings/UserForm';
import ProfileForm from '@/components/blocks/settings/ProfileForm';

export default async function Profile() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select()
    .eq('user_id', user?.id)
    .single();

  return (
    <div className='grid gap-6'>
      <UserForm user={user} />
      <ProfileForm profile={profile} />
    </div>
  );
}
