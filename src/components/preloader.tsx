'use client';

import { Sprout } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Preloader() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background transition-opacity duration-300 ${isMounted ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex items-center gap-3">
        <Sprout className="h-12 w-12 text-primary animate-pulse" />
        <span className="text-2xl font-bold text-primary">Annadata AI</span>
      </div>
       <p className="mt-4 text-muted-foreground">Loading your smart farming dashboard...</p>
    </div>
  );
}
