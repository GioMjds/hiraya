'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Bell, Search, Menu, PanelLeftClose } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ThemeToggle from '@/components/shared/theme-switcher';
import { useNavRailStore } from '@/stores';
import type { Roles } from '@/utils/sidebar';
import { AuthorizedProfile, getRoleAction } from './authorized';
import { ROLE_UI_CONFIG } from './authorized/role-ui-config';

interface HeaderProps {
  role: Roles;
}

export function Header({ role }: HeaderProps) {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse } = useNavRailStore();
  const [mounted, setMounted] = useState<boolean>(false);
  const roleConfig = ROLE_UI_CONFIG[role];

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const active = mounted ? isCollapsed : false;
  const segments = pathname.split('/').filter(Boolean);
  const roleIndex = segments.lastIndexOf(role);
  const localePrefix =
    roleIndex > 0 ? `/${segments.slice(0, roleIndex).join('/')}` : '';
  
  const roleSegments = roleIndex >= 0 ? segments.slice(roleIndex + 1) : [];
  const roleAction = getRoleAction(role, roleSegments[0], localePrefix);

  return (
    <div className="h-16 border-b px-4 flex items-center justify-between bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="h-9 w-9"
          aria-label={active ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {active ? (
            <Menu className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>

        <div className="font-bold text-2xl tracking-tight hidden md:block">
          Hiraya
        </div>
        <Separator orientation="vertical" className="h-6 hidden md:block" />
        <Badge variant="outline" className={roleConfig.roleBadgeClassName}>
          {role}
        </Badge>
      </div>

      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={roleConfig.searchPlaceholder}
            className={cn(
              'pl-9 h-9 w-full rounded-full bg-muted/50 focus-visible:bg-background',
              role === 'admin' ? 'focus-visible:ring-primary/30' : '',
            )}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {roleAction ? (
          <Button
            variant="outline"
            size="sm"
            className="hidden md:inline-flex"
            asChild
          >
            <Link href={roleAction.href as Route}>
              {roleAction.label}
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        ) : null}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        <ThemeToggle />
        <AuthorizedProfile />
      </div>
    </div>
  );
}
