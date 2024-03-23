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
      <div>
        {user?.user_metadata.full_name && (
          <div className='text-sm text-gray-400'>
            Hi, {user.user_metadata.full_name}
          </div>
        )}

        <ProfileMenu user={user} />
      </div>
    </header>
  );
}
