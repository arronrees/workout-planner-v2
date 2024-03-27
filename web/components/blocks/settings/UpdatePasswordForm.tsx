'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { updateUserPassword } from '@/lib/user/auth';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

const initialState = {
  errorMessage: null,
  success: false,
};

export default function UpdatePasswordForm() {
  const [state, formAction] = useFormState(updateUserPassword, initialState);

  const { toast } = useToast();

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Pasword Updated',
        description: 'Your password has been updated successfully',
      });
    }
  }, [state.success, toast]);

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Update your password</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='password'>Password:</Label>
              <Input
                placeholder='Password'
                name='password'
                id='password'
                type='password'
                required
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='passwordConfirmation'>
                Password confirmation:
              </Label>
              <Input
                placeholder='Password confirmation'
                name='passwordConfirmation'
                id='passwordConfirmation'
                type='password'
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className='border-t p-6'>
          <div>
            {state.errorMessage && (
              <div className='text-red-500 mb-2'>{state.errorMessage}</div>
            )}
            <SubmitBtn />
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}

function SubmitBtn() {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' disabled={pending} aria-disabled={pending}>
      Save
    </Button>
  );
}
