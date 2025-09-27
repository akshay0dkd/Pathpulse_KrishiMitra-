'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, Cloud, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/chat', icon: MessageSquare, label: 'Chat' },
  { href: '/weather', icon: Cloud, label: 'Weather' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-t-lg md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link href={item.href} key={item.href} className="flex flex-col items-center justify-center w-full text-muted-foreground hover:text-primary transition-colors">
              <item.icon className={cn("h-6 w-6", isActive && "text-primary")} />
              <span className={cn("text-xs mt-1", isActive && "text-primary font-semibold")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
