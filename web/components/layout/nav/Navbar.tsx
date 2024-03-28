'use client';

import Link from 'next/link';
import { Package2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  return (
    <nav>
      <ul className='gap-2 text-sm font-medium flex items-center md:gap-4 lg:gap-6'>
        <Link
          href='#'
          className='flex items-center gap-2 text-lg font-semibold md:text-base'
        >
          <Package2 className='h-6 w-6' />
        </Link>

        <NavLink href='/dashboard' text='Dashboard' />
        <NavLink href='/workouts' text='Workouts' />
        <NavLink href='/exercises' text='Exercises' />
      </ul>
    </nav>
  );
}

function NavLink({ href, text }: { href: string; text: string }) {
  const pathname = usePathname();

  return (
    <Link
      className={`${
        pathname === href ? 'text-foreground' : 'text-muted-foreground'
      } transition-colors hover:text-foreground`}
      href={href}
    >
      {text}
    </Link>
  );
}
