import ForgotPasswordForm from '@/components/blocks/auth/ForgotPasswordForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
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
    <Card className='max-w-lg mx-auto'>
      <CardHeader>
        <CardTitle>Forgot your password</CardTitle>
        <CardDescription>
          Enter your email below to request a reset token
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ForgotPasswordForm />
      </CardContent>

      <CardFooter className='border-t p-6'>
        <p className='font-light text-xs'>
          Remembered your password?{' '}
          <Link href='/auth/signin' className='font-semibold'>
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
