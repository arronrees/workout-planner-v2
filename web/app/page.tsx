import Image from 'next/image';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  // console.log('server: ', data?.user);

  return (
    <div className='page__card'>
      <div className='h-96 p-8 pt-6'>
        <figure className='w-full h-full overflow-hidden relative'>
          <Image
            src='/register-illustration.svg'
            className='object-contain w-full h-full'
            priority
            fill
            alt=''
          />
        </figure>
      </div>
      <section>
        <h1 className='font-extralight text-4xl text-center mb-4'>
          Let&apos;s get moving
        </h1>
        <p className='font text-center mb-10 text-slate-500'>
          Sign up to get started tracking your workouts and reaching your goals
        </p>
        <div className='flex items-center justify-center'>
          <Link
            href='/auth/signup'
            className={buttonVariants({ variant: 'default' })}
          >
            Register Now
          </Link>
        </div>
        <p className='text-center font-extralight text-xs mt-6'>
          Already have an account?{' '}
          <Link href='/auth/signin' className='font-semibold'>
            Sign In
          </Link>
        </p>
      </section>
    </div>
  );
}
