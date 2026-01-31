import Link from 'next/link';
import { Sprout, Shield } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">
              Annadata AI
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <LanguageSwitcher />
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin">
              <Shield className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Admin Panel</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
