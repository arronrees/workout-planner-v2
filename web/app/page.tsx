import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <div className='h-96 p-8 pt-32'>
        <figure>
          <Image
            src='/register-illustration.svg'
            className='object-contain'
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
        <p className='font text-center mb-16 text-zinc-500'>
          Sign up to get started tracking your workouts and reaching your goals
        </p>
        <Link href='/auth/signup' className='btn btn--green'>
          Register Now
        </Link>
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
