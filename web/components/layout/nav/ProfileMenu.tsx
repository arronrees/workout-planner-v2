'use client';

import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { type User } from '@supabase/supabase-js';
import Link from 'next/link';

export function ProfileMenu({ user }: { user: User | null; profile: any }) {
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>
          <UserCircleIcon className='w-5 h-5 stroke-2' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end'>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href='/profile' className='cursor-pointer'>
              <UserIcon className='mr-2 h-4 w-4' />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/profile/preferences' className='cursor-pointer'>
              <Settings className='mr-2 h-4 w-4' />
              <span>Preferences</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form className='w-full' action='/auth/signout' method='post'>
            <button type='submit' className='flex items-center w-full'>
              <LogOut className='mr-2 h-4 w-4' />
              Log out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
