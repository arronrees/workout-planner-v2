'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { forgotPassword } from '@/lib/user/auth';

const initialState = {
  errorMessage: null,
  success: false,
};

export default function ForgotPasswordForm() {
  const [state, formAction] = useFormState(forgotPassword, initialState);

  const { toast } = useToast();

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Request sent',
        description:
          'Please check your email for instructions on how to reset your password.',
      });
      redirect('/auth/signin');
    }
  }, [state.success, toast]);

  return (
    <div>
      <form className='flex flex-col gap-4' action={formAction}>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='email'>Email:</Label>
          <Input id='email' name='email' type='email' required />
        </div>

        <div>
          {state.errorMessage && (
            <div className='text-red-500 mb-2'>{state.errorMessage}</div>
          )}
          <SubmitBtn />
        </div>
      </form>
    </div>
  );
}

function SubmitBtn() {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' disabled={pending} aria-disabled={pending}>
      Reset Password
    </Button>
  );
}
