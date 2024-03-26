import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function SignIn() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  return (
    <div className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-2 md:p-6 md:gap-8'>
      <div className='mx-auto grid w-full max-w-6xl gap-2'>
        <h1 className='text-3xl font-semibold'>Profile & Settings</h1>
      </div>
      <div className='mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]'>
        <nav className='grid gap-4 text-sm text-muted-foreground'>
          <Link href='/profile' className='font-semibold text-primary'>
            General
          </Link>
          <Link href='#'>Preferences</Link>
          <Link href='#'>Password & Security</Link>
        </nav>
        <div className='grid gap-6'>
          <Card>
            <CardHeader>
              <CardTitle>Personal details</CardTitle>
              <CardDescription>Update your details</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <Input placeholder='Your name' />
              </form>
            </CardContent>
            <CardFooter className='border-t p-6'>
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
