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

  return (
    <header className='flex items-center justify-between gap-2'>
      <div className='flex items-center gap-2'>
        <Navbar />
        <HomeIcon />
      </div>
      <div className='flex items-center gap-4'>
        {user?.user_metadata && (
          <div className='text-sm text-slate-600'>
            Hi, {user.user_metadata?.first_name}
          </div>
        )}

        <ProfileMenu user={user} />
      </div>
    </header>
  );
}
