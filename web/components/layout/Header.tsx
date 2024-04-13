import { ProfileMenu } from './nav/ProfileMenu';
import { createClient } from '@/utils/supabase/server';
import Navbar from './nav/Navbar';

export default async function Header() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className='px-8 md:px-12 py-6 bg-white border-b-[2px] border-b-slate-200'></div>
    );
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select()
    .eq('user_id', user?.id)
    .single();

  return (
    <header className='flex items-center justify-between gap-2 bg-white border-b-[2px] border-b-slate-200 px-6 py-6'>
      {user && (
        <div className='flex items-center gap-2'>
          <Navbar />
        </div>
      )}
      <div className='flex items-center gap-4'>
        {profile && (
          <div className='text-sm text-slate-600'>
            Hi, {profile.display_name}
          </div>
        )}

        <ProfileMenu user={user} profile={profile} />
      </div>
    </header>
  );
}
