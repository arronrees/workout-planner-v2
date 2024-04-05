import Link from 'next/link';
import { Activity, ArrowUpRight, Clock, Dumbbell, Weight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function Dashboard() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  return (
    <div className='flex flex-1 flex-col gap-4 md:gap-8'>
      <div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Volume Lifted
            </CardTitle>
            <Weight className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>670kg</div>
            <p className='text-xs text-muted-foreground'>
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Workouts Completed
            </CardTitle>
            <Activity className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>15</div>
            <p className='text-xs text-muted-foreground'>
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Exercises Performed
            </CardTitle>
            <Dumbbell className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>124</div>
            <p className='text-xs text-muted-foreground'>
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Hours Exercising
            </CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>573</div>
            <p className='text-xs text-muted-foreground'>
              +201 from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className='grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3'>
        <Card className='xl:col-span-2'>
          <CardHeader className='flex flex-row items-center'>
            <div className='grid gap-2'>
              <CardTitle>Workout History</CardTitle>
              <CardDescription>Recent workouts completed</CardDescription>
            </div>
            <Button asChild size='sm' className='ml-auto gap-1'>
              <Link href='/workouts'>
                View All
                <ArrowUpRight className='h-4 w-4' />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Weight Lifted</TableHead>
                  <TableHead className='text-right'>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className='font-medium'>Upper body</div>
                  </TableCell>
                  <TableCell>240kg</TableCell>
                  <TableCell className='text-right'>2023-06-23</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className='font-medium'>Lower body</div>
                  </TableCell>
                  <TableCell>240kg</TableCell>
                  <TableCell className='text-right'>2023-06-23</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className='font-medium'>Full body</div>
                  </TableCell>
                  <TableCell>240kg</TableCell>
                  <TableCell className='text-right'>2023-06-23</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Favourite Exercises</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-8'>
            <div className='flex items-center gap-4'>
              <div className='grid gap-1'>
                <p className='text-sm font-medium leading-none'>
                  Barbell Back Squat
                </p>
                <p className='text-sm text-muted-foreground'>8 in past week</p>
              </div>
              <div className='ml-auto font-medium'>75kg</div>
            </div>
            <div className='flex items-center gap-4'>
              <div className='grid gap-1'>
                <p className='text-sm font-medium leading-none'>Bench Press</p>
                <p className='text-sm text-muted-foreground'>8 in past week</p>
              </div>
              <div className='ml-auto font-medium'>75kg</div>
            </div>
            <div className='flex items-center gap-4'>
              <div className='grid gap-1'>
                <p className='text-sm font-medium leading-none'>
                  Military Press
                </p>
                <p className='text-sm text-muted-foreground'>8 in past week</p>
              </div>
              <div className='ml-auto font-medium'>75kg</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
