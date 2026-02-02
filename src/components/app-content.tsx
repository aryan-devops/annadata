
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import Preloader from '@/components/preloader';
import AdminLayout from '@/components/admin-layout';
import { Toaster } from '@/components/ui/toaster';
import { usePathname } from 'next/navigation';

export default function AppContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { isUserLoading } = useUser();

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (!isUserLoading) {
        const timer = setTimeout(() => setIsInitialLoading(false), 500);
        return () => clearTimeout(timer);
    }
  }, [isUserLoading]);

  if (pathname === '/login') {
      return (
          <>
            {children}
            <Toaster />
          </>
      )
  }

  if (isInitialLoading) {
      return <Preloader />;
  }
  
  return (
    <>
      <AdminLayout>{children}</AdminLayout>
      <Toaster />
    </>
  );
}
