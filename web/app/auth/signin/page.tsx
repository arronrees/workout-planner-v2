import DividerLine from '@/components/layout/DividerLine';
import Link from 'next/link';
import SignInForm from '@/components/blocks/SignInForm';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function SignIn() {
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
        <h1 className='font-extralight text-4xl mb-4'>Keep on moving</h1>
        <p className='font  mb-6 text-zinc-500'>
          Sign in to keep on reaching your goals
        </p>
        <p className='font-extralight text-xs'>
          Don&apos;t have an account?{' '}
          <Link href='/auth/signup' className='font-semibold'>
            Sign Up
          </Link>
        </p>
      </section>

      <DividerLine />

      <section className='mt-6'>
        <SignInForm />

        <Link
          href='/auth/user/reset-password/request'
          className='block font-semibold text-zinc-400 text-xs mt-6 hover:text-zinc-500 focus:text-zinc-500'
        >
          Forgot your password?
        </Link>
      </section>
    </div>
  );
}
