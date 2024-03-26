import DividerLine from '@/components/layout/DividerLine';
import Link from 'next/link';
import SignUpForm from '@/components/blocks/auth/SignUpForm';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function SignUp() {
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
        <h1 className='page__headline'>Let&apos;s get moving</h1>
        <p className='page__lead'>
          Sign up to get started tracking your workouts and reaching your goals
        </p>
      </section>

      <DividerLine />

      <section>
        <SignUpForm />

        <p className='font-extralight text-xs mt-6'>
          Already have an account?{' '}
          <Link href='/auth/signin' className='font-semibold'>
            Sign In
          </Link>
        </p>
      </section>
    </div>
  );
}
