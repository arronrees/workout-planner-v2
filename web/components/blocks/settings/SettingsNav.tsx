'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SettingsNav() {
  return (
    <nav className='grid gap-4 text-sm text-muted-foreground'>
      <NavLink href='/profile' text='General' />
      <NavLink href='/profile/preferences' text='Preferences' />
      <NavLink
        href='/profile/password-and-security'
        text='Password & Security'
      />
    </nav>
  );
}

function NavLink({ href, text }: { href: string; text: string }) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={pathname === href ? 'font-semibold text-primary' : ''}
    >
      {text}
    </Link>
  );
}
