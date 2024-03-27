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
import { updateUser } from '@/lib/user/auth';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

const initialState = {
  errorMessage: null,
  success: false,
};

export default function UserForm({ user }: { user: any }) {
  const [state, formAction] = useFormState(updateUser, initialState);

  const { toast } = useToast();

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'User Updated',
        description: 'Your details have been updated successfully',
      });
    }
  }, [state.success, toast]);

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Personal details</CardTitle>
          <CardDescription>Update your details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='firstName'>First Name:</Label>
              <Input
                placeholder='First name'
                name='firstName'
                id='firstName'
                type='text'
                required
                defaultValue={user?.user_metadata.first_name || ''}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='lastName'>Last Name:</Label>
              <Input
                placeholder='Last name'
                name='lastName'
                id='lastName'
                type='text'
                required
                defaultValue={user?.user_metadata.last_name || ''}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='email'>Your Email:</Label>
              <Input
                placeholder='Your email'
                name='email'
                id='email'
                type='email'
                required
                defaultValue={user?.email || ''}
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
