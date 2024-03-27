import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import UpdatePasswordForm from '@/components/blocks/settings/UpdatePasswordForm';

export default async function PasswordAndSecurity() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  return (
    <div className='grid gap-6'>
      <UpdatePasswordForm />
    </div>
  );
}
