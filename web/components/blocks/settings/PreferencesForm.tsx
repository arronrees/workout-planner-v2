'use client';

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
import { updatePreferences } from '@/lib/user/preferences';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

const initialState = {
  errorMessage: null,
  success: false,
};

export default function PreferencesForm({
  preferences,
}: {
  preferences: Database['public']['Tables']['user_preferences']['Row'] | null;
}) {
  const [state, formAction] = useFormState(updatePreferences, initialState);

  const { toast } = useToast();

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Preferences Updated',
        description: 'Your preferences have been updated successfully',
      });
    }
  }, [state.success, toast]);

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Update your preferences for the site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='displayName'>Weight Unit:</Label>
              <Select
                name='weightUnit'
                required
                defaultValue={preferences?.weight_unit || 'kg'}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Weight Unit' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='kg'>kg</SelectItem>
                  <SelectItem value='lbs'>lbs</SelectItem>
                </SelectContent>
              </Select>
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
