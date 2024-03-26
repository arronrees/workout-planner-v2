'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { redirect } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { resetPassword } from '@/lib/user/auth';

const initialState = {
  errorMessage: null,
  success: false,
};

export default function ForgotPasswordForm() {
  const [state, formAction] = useFormState(resetPassword, initialState);

  const { toast } = useToast();

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Password updated',
        description: 'Your password has been reset successfully.',
      });
      redirect('/auth/signin');
    }
  }, [state.success, toast]);

  return (
    <div>
      <form className='flex flex-col gap-4' action={formAction}>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='password'>Password:</Label>
          <Input id='password' name='password' type='password' required />
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='passwordConfirmation'>Password confirmation:</Label>
          <Input
            id='passwordConfirmation'
            name='passwordConfirmation'
            type='password'
            required
          />
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
