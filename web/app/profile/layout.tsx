import * as React from 'react';
import SettingsNav from '@/components/blocks/settings/SettingsNav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-2 md:p-6 md:gap-6'>
      <div className='mx-auto grid w-full gap-2'>
        <h1 className='text-3xl font-semibold'>Profile & Settings</h1>
      </div>
      <div className='mx-auto grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]'>
        <SettingsNav />
        {children}
      </div>
    </div>
  );
}
