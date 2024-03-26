import DividerLine from '@/components/layout/DividerLine';
import Link from 'next/link';
import SignInForm from '@/components/blocks/auth/SignInForm';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function SignIn() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/');
  }

  return (
    <div>
      <section>
        <h1 className='page__headline'>Keep on moving</h1>
        <p className='page__lead'>Sign in to keep on reaching your goals</p>
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
          href='/auth/forgot-password'
          className='block font-medium text-slate-400 text-xs mt-6 hover:text-slate-500 focus:text-slate-500'
        >
          Forgot your password?
        </Link>
      </section>
    </div>
  );
}
