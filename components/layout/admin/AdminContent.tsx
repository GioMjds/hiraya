'use client';

import type { Route } from 'next';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Header, NavRail } from '@/components/layout';
import type { NavItem } from '@/utils/sidebar';
import { useNavRailStore } from '@/stores';

interface NavItemWithRoute extends Omit<NavItem, 'href' | 'children'> {
  href: Route;
  children?: NavItemWithRoute[];
}

export default function AdminContent({
  navItems,
  children,
}: {
  navItems: NavItem[];
  children: React.ReactNode;
}) {
  const { isCollapsed } = useNavRailStore();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const active = mounted ? isCollapsed : false;

  const mapNavItems = (items: NavItem[]): NavItemWithRoute[] => {
    return items.map((item) => ({
      ...item,
      href: (item.href || '') as Route,
      children: item.children ? mapNavItems(item.children) : undefined,
    }));
  };

  const mappedItems = mapNavItems(navItems);

  return (
    <div className="h-screen flex flex-col">
      <header className="w-full shrink-0">
        <Header role="admin" />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="border-r shrink-0">
          <NavRail items={mappedItems} />
        </aside>
        <main
          className={cn(
            'flex-1 p-8 transition-all duration-300 overflow-y-auto',
            active ? 'ml-0' : 'ml-0',
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
