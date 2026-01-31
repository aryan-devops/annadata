'use client';

import { useState, useEffect } from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import AdminLayout from '@/components/admin-layout';
import Preloader from '@/components/preloader';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulates app loading time.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Annadata AI v2.0</title>
        <meta name="description" content="AI-powered farming assistant for Indian farmers" />
      </head>
      <body className={cn("font-sans antialiased", inter.variable)}>
        {isLoading ? <Preloader /> : (
          <FirebaseClientProvider>
            <LanguageProvider>
                <AdminLayout>{children}</AdminLayout>
              <Toaster />
            </LanguageProvider>
          </FirebaseClientProvider>
        )}
      </body>
    </html>
  );
}
