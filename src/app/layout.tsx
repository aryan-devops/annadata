'use client';

import './globals.css';
import { LanguageProvider } from '@/context/language-context';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import AppContent from '@/components/app-content';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Annadata</title>
        <meta name="description" content="A smart farming assistant for Indian farmers" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={cn("font-sans antialiased", inter.variable)}>
        <FirebaseClientProvider>
          <LanguageProvider>
            <AppContent>{children}</AppContent>
          </LanguageProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
