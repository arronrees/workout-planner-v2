import * as React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import ProgressBarProvider from '@/components/layout/ProgressBarProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Workout Planner',
  description: 'Workout Planner',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ProgressBarProvider>
          <Header />
          <div className='p-6 text-sm bg-slate-50 min-h-screen'>
            <main>{children}</main>
            <Toaster />
          </div>
        </ProgressBarProvider>
      </body>
    </html>
  );
}
