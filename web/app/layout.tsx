import type { Metadata } from 'next';
import { Sora } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';

const sora = Sora({ subsets: ['latin'] });

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
      <body className={sora.className}>
        <Header />
        <div className='p-6 text-sm bg-slate-100 min-h-screen'>
          <main>{children}</main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
