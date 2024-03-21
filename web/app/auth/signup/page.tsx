import DividerLine from '@/components/layout/DividerLine';
import Link from 'next/link';
import SignUpForm from '@/components/blocks/SignUpForm';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function SignUp() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/');
  }

  return (
    <div>
      <section>
        <h1 className='font-extralight text-4xl mb-4'>Let&apos;s get moving</h1>
        <p className='font mb-6 text-zinc-500'>
          Sign up to get started tracking your workouts and reaching your goals
        </p>
        <p className='font-extralight text-xs'>
          Already have an account?{' '}
          <Link href='/auth/signin' className='font-semibold'>
            Sign In
          </Link>
        </p>
      </section>

      <DividerLine />

      <section className='mt-6'>
        <SignUpForm />
      </section>
    </div>
  );
}
