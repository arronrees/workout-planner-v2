import DividerLine from '@/components/layout/DividerLine';
import Link from 'next/link';
import {
  ArrowRightStartOnRectangleIcon,
  QueueListIcon,
  SquaresPlusIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const user = true;
  return (
    <nav
      className='fixed z-50 left-6 border-2 border-zinc-200 rounded bg-zinc-50 shadow-md'
      style={{
        width: 'calc(100vw - 3rem)',
        height: 'calc(100vh - 7.5rem)',
        top: '6rem',
      }}
    >
      <ul className='p-6'>
        {user && (
          <>
            <li>
              <Link href='/exercises' className='nav__link'>
                <QueueListIcon className='w-4 h-6' />
                <span>My Exercises</span>
              </Link>
            </li>
            <li>
              <Link href='/exercises/new' className='nav__link'>
                <SquaresPlusIcon className='w-4 h-6' />
                <span>Create Exercise</span>
              </Link>
            </li>

            <DividerLine className='py-2' />

            <li>
              <Link href='/workouts' className='nav__link'>
                <QueueListIcon className='w-4 h-6' />
                <span>My Workouts</span>
              </Link>
            </li>
            <li>
              <Link href='/workouts/new' className='nav__link'>
                <SquaresPlusIcon className='w-4 h-6' />
                <span>Create Workout</span>
              </Link>
            </li>

            <DividerLine className='py-2' />

            <li>
              <Link href='/user/profile' className='nav__link'>
                <UserIcon className='w-4 h-6' />
                <span>My Profile</span>
              </Link>
            </li>
            <li>
              <Link href='/api/auth/signout' className='nav__link text-red-700'>
                <ArrowRightStartOnRectangleIcon className='w-4 h-6' />
                <span>Logout</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
