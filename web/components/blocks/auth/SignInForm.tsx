'use client';

import { login } from '@/lib/user/auth';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useToast } from '../../ui/use-toast';

const initialState = {
  errorMessage: null,
  success: false,
};

export default function SignInForm() {
  const [state, formAction] = useFormState(login, initialState);

  const { toast } = useToast();

  useEffect(() => {
    if (state.success) {
      toast({ title: 'Welcome back', description: 'Sign in successful' });
      redirect('/');
    }
  }, [state.success, toast]);

  return (
    <div>
      <form className='flex flex-col gap-4' action={formAction}>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='email'>Email:</Label>
          <Input id='email' name='email' type='email' required />
        </div>

        <div className='flex flex-col gap-2'>
          <Label htmlFor='password'>Password:</Label>
          <Input id='password' name='password' type='password' required />
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
      Sign In
    </Button>
  );
}
