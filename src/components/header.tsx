
'use client';
    
import Link from 'next/link';
import { Leaf, Shield, LogOut } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';

export function Header() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const { user } = useUser();
  const auth = useAuth();
  
  const handleLogout = () => {
      auth.signOut();
  };

  if (isAdminRoute) {
    return null; // Header is not shown on admin routes, they have their own sidebar/header
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">
              Annadata
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <LanguageSwitcher />
          {user ? (
            <Button onClick={handleLogout} variant="ghost" size="icon" title="Logout">
                <LogOut className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Logout</span>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="icon" title="Admin Panel">
              <Link href="/admin">
                <Shield className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Admin Panel</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
