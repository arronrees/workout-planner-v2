'use client';

import ResetPasswordForm from '@/components/blocks/auth/ResetPasswordForm';
import DividerLine from '@/components/layout/DividerLine';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ResetPassword() {
  const supabase = createClient();

  const router = useRouter();

  const { toast } = useToast();

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: 'Invalid reset token',
          description: 'You must be signed in to reset your password',
        });
        return router.push('/');
      }
    }
    checkUser();
  }, [supabase, router, toast]);

  return (
    <div className='page__card'>
      <section>
        <h1 className='page__headline'>Reset your password</h1>
        <p className='page__lead'>
          Fill out the form below to reset your password.
        </p>
      </section>

      <DividerLine />

      <section>
        <ResetPasswordForm />
      </section>
    </div>
  );
}
