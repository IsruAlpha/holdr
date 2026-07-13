'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Film } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Discover', href: '/dashboard', icon: Search },
  { name: 'My List', href: '/dashboard', icon: Film },
];

export function NativeTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive =
            tab.href === '/'
              ? pathname === '/'
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-1 text-[10px] font-medium transition-colors',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <tab.icon className={cn('h-5 w-5', isActive && 'fill-current')} />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
