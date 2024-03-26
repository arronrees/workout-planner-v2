import ForgotPasswordForm from '@/components/blocks/auth/ForgotPasswordForm';
import DividerLine from '@/components/layout/DividerLine';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ForgotPassword() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/');
  }

  return (
    <div className='page__card'>
      <section>
        <h1 className='page__headline'>Forgot your password</h1>
        <p className='page__lead'>
          Enter your email below to request a reset token
        </p>
      </section>

      <DividerLine />

      <section>
        <ForgotPasswordForm />
      </section>
    </div>
  );
}
