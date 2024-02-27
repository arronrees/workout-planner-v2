import type { Metadata } from 'next';
import { Sora } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';

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
        <div className='p-6 text-sm'>
          <Header />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
