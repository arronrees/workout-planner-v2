import Navbar from './nav/NavMenu';
import { ProfileMenu } from './nav/ProfileMenu';
import HomeIcon from '@/components/layout/nav/HomeLink';
import { createClient } from '@/utils/supabase/server';

export default async function Header() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('user_profile')
    .select()
    .eq('user_id', user?.id)
    .single();

  return (
    <header className='flex items-center justify-between gap-2 bg-white border-b-[2px] border-b-slate-200 p-6'>
      <div className='flex items-center gap-2'>
        <Navbar />
        <HomeIcon />
      </div>
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
