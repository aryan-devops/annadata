'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import Preloader from '@/components/preloader';
import AdminLayout from '@/components/admin-layout';
import { Toaster } from '@/components/ui/toaster';

export default function AppContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [minTimePassed, setMinTimePassed] = useState(false);
  // isUserLoading is true until Firebase determines the initial auth state.
  const { isUserLoading } = useUser(); 

  useEffect(() => {
    // Set a minimum display time for the preloader to avoid flashes
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  // Show preloader until Firebase is ready AND minimum time has passed.
  const showPreloader = !minTimePassed || isUserLoading;

  if (showPreloader) {
    return <Preloader />;
  }

  return (
    <>
      <AdminLayout>{children}</AdminLayout>
      <Toaster />
    </>
  );
}
