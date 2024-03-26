import Image from 'next/image';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // if(user) {
  // redirect('/dashboard')
  // }

  return (
    <Card className='max-w-lg mx-auto text-center'>
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
      <CardHeader>
        <CardTitle>Let&apos;s get moving</CardTitle>
        <CardDescription className='max-w-sm mx-auto'>
          Sign up to get started tracking your workouts and reaching your goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <Link
            href='/auth/signup'
            className={buttonVariants({ variant: 'default' })}
          >
            Register Now
          </Link>
        </div>

        <p className='font-light mt-6'>
          Already have an account?{' '}
          <Link href='/auth/signin' className='font-semibold'>
            Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
