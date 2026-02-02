'use client';

import Image from 'next/image';

export default function Preloader() {
  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 rounded-full bg-primary/10 animate-pulse"></div>
        <div className="absolute h-40 w-40 rounded-full bg-primary/5 animate-pulse delay-75"></div>
        <div className="animate-logo-bounce">
            <Image src="/favicon.ico" alt="Annadata Logo" width={64} height={64} />
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center gap-2 text-center animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Annadata</h1>
        <p className="text-muted-foreground">Loading your smart farming dashboard...</p>
      </div>
    </div>
  );
}
