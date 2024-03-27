import { Button } from '@/components/ui/button';
import { HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function HomeLink() {
  return (
    <Button asChild variant='outline'>
      <Link href='/dashboard'>
        <HomeIcon className='w-5 h-5 stroke-2' />
      </Link>
    </Button>
  );
}
