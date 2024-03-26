import Link from 'next/link';
import SignUpForm from '@/components/blocks/auth/SignUpForm';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

export default async function SignUp() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/');
  }

  return (
    <Card className='max-w-lg mx-auto'>
      <CardHeader>
        <CardTitle>Let&apos;s get moving</CardTitle>
        <CardDescription>
          Sign up to get started tracking your workouts and reaching your goals
        </CardDescription>
      </CardHeader>

      <CardContent>
        <SignUpForm />
      </CardContent>

      <CardFooter className='border-t p-6'>
        <p className='font-extralight text-xs'>
          Already have an account?{' '}
          <Link href='/auth/signin' className='font-semibold'>
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
