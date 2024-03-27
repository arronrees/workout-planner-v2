import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import UserForm from '@/components/blocks/settings/UserForm';
import ProfileForm from '@/components/blocks/settings/ProfileForm';

export default async function SignIn() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select()
    .eq('user_id', user?.id)
    .single();

  return (
    <div className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-2 md:p-6 md:gap-8'>
      <div className='mx-auto grid w-full max-w-6xl gap-2'>
        <h1 className='text-3xl font-semibold'>Profile & Settings</h1>
      </div>
      <div className='mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]'>
        <nav className='grid gap-4 text-sm text-muted-foreground'>
          <Link href='/profile' className='font-semibold text-primary'>
            General
          </Link>
          <Link href='#'>Preferences</Link>
          <Link href='#'>Password & Security</Link>
        </nav>
        <div className='grid gap-6'>
          <UserForm user={user} />
          <ProfileForm profile={profile} />
        </div>
      </div>
    </div>
  );
}
