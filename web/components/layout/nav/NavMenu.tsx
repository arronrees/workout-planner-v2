import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Dumbbell, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Bars2Icon } from '@heroicons/react/24/outline';

export default async function NavMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>
          <Bars2Icon className='w-5 h-5 stroke-2' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='start'>
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Activity className='mr-2 h-4 w-4' />
            <span>Create Workout</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Dumbbell className='mr-2 h-4 w-4' />
            <span>New Exercise</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Dumbbell className='mr-2 h-4 w-4' />
          <span>My Exercises</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Activity className='mr-2 h-4 w-4' />
          <span>My Workouts</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
