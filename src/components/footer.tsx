
import { Instagram, Linkedin, Facebook, Github } from 'lucide-react';
import Link from 'next/link';

const socialLinks = [
  {
    href: 'https://www.linkedin.com/in/aryan-pandey-4581921a0/',
    icon: <Linkedin className="h-5 w-5" />,
    label: 'LinkedIn',
  },
  {
    href: 'https://www.facebook.com/profile.php?id=100022274959013',
    icon: <Facebook className="h-5 w-5" />,
    label: 'Facebook',
  },
  {
    href: 'https://github.com/aryan-devops',
    icon: <Github className="h-5 w-5" />,
    label: 'GitHub',
  },
  {
    href: 'https://www.instagram.com/aryan.devops',
    icon: <Instagram className="h-5 w-5" />,
    label: 'Instagram',
  },
];

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border/40">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          Created by <span className="font-bold">Aryan Pandey</span>
        </p>
        <div className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label={link.label}
            >
              {link.icon}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
