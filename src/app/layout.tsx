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
        <title>Annadata AI v2.0</title>
        <meta name="description" content="AI-powered farming assistant for Indian farmers" />
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
