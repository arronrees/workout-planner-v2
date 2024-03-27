'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database } from '@/database.types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFormState, useFormStatus } from 'react-dom';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';
import { updateProfile } from '@/lib/user/profile';

const initialState = {
  errorMessage: null,
  success: false,
};

export default function ProfileForm({
  profile,
}: {
  profile: Database['public']['Tables']['user_profiles']['Row'] | null;
}) {
  const [state, formAction] = useFormState(updateProfile, initialState);

  const { toast } = useToast();

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully',
      });
    }
  }, [state.success, toast]);

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Public Profile</CardTitle>
          <CardDescription>Update your public profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='displayName'>Display Name:</Label>
              <Input
                placeholder='Display name'
                name='displayName'
                id='displayName'
                type='text'
                required
                defaultValue={profile?.display_name || ''}
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
