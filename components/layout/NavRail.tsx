'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavRailStore } from '@/stores';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Roles } from '@/utils/sidebar';
import { ROLE_UI_CONFIG } from './authorized/role-ui-config';

interface NavItemBase {
  id: string;
  label: string;
  href: Route;
  icon?: string;
  children?: NavItemBase[];
}

interface NavRailProps {
  items: readonly NavItemBase[];
  role: Roles;
}

export function NavRail({ items, role }: NavRailProps) {
  const pathname = usePathname();
  const { isCollapsed } = useNavRailStore();
  const [mounted, setMounted] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const roleConfig = ROLE_UI_CONFIG[role];

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const getIcon = (iconName?: string, depth: number = 0) => {
    const aliases: Record<string, string> = {
      chart: 'BarChart3',
      file: 'FileText',
      home: 'Home',
      users: 'Users',
      settings: 'Settings',
    };

    const name = iconName
      ? aliases[iconName.toLowerCase()] || iconName
      : 'Circle';
    const capitalizedIcon = name.charAt(0).toUpperCase() + name.slice(1);
    const icons = LucideIcons as unknown as Record<string, React.ElementType>;
    const IconComponent =
      icons[capitalizedIcon] || icons[name] || LucideIcons.Circle;

    return (
      <IconComponent
        className={cn(
          'shrink-0 transition-all duration-200',
          depth > 0
            ? 'h-1.5 w-1.5 opacity-40 group-hover:opacity-100'
            : 'h-4 w-4',
        )}
      />
    );
  };

  const getCurrentLocale = (): string => {
    const segments = pathname.split('/');
    return segments[1] || 'en';
  };

  const getLocalizedHref = (href: Route): Route => {
    const locale = getCurrentLocale();
    return `/${locale}${href}` as Route;
  };

  const normalizePath = (value: string): string => {
    if (value.endsWith('/') && value !== '/') {
      return value.slice(0, -1);
    }
    return value;
  };

  const isPathActive = (href: Route): boolean => {
    const localizedHref = normalizePath(getLocalizedHref(href));
    const currentPath = normalizePath(pathname);
    return (
      currentPath === localizedHref || currentPath.startsWith(`${localizedHref}/`)
    );
  };

  const isParentActive = (children?: NavItemBase[]): boolean => {
    if (!children) return false;
    return children.some((child) => isPathActive(child.href));
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const active = mounted ? isCollapsed : false;

  const renderNavItem = (item: NavItemBase, depth: number = 0) => {
    const localizedHref = getLocalizedHref(item.href);
    const isActive = isPathActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const parentIsActive = isParentActive(item.children);
    const isExpanded = parentIsActive || expandedItems.has(item.id);

    const button = (
      <Button
        key={item.id}
        asChild={!hasChildren}
        variant={isActive ? 'secondary' : 'ghost'}
        className={cn(
          'group h-10 w-full justify-start transition-all duration-200 border-l-2 rounded-l-none',
          depth > 0 && !active ? 'ml-3 w-[calc(100%-0.75rem)]' : '',
          isActive || parentIsActive ? 'border-l-primary' : 'border-l-transparent',
          isActive || parentIsActive
            ? roleConfig.navItemActiveClassName
            : roleConfig.navItemInactiveClassName,
        )}
        onClick={hasChildren ? () => toggleExpanded(item.id) : undefined}
      >
        {hasChildren ? (
          <div className="flex items-center gap-3 w-full">
            <div className="flex h-5 w-5 items-center justify-center shrink-0">
              {getIcon(item.icon)}
            </div>
            <span
              className={cn(
                'transition-all duration-200 flex-1 text-left',
                active ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100',
              )}
            >
              {item.label}
            </span>
            {!active && (
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  isExpanded ? 'rotate-180' : '',
                )}
              />
            )}
          </div>
        ) : (
          <Link href={{ pathname: localizedHref }} className="flex items-center gap-3 w-full">
            <div className="flex h-5 w-5 items-center justify-center shrink-0">
              {getIcon(item.icon, depth)}
            </div>
            <span
              className={cn(
                'transition-all duration-200 flex-1 text-left truncate',
                active ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100',
                depth > 0 ? 'text-[13px] pl-1 font-medium' : 'text-sm font-medium'
              )}
            >
              {item.label}
            </span>
          </Link>
        )}
      </Button>
    );

    if (active) {
      return (
        <Tooltip key={item.id}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <div key={item.id}>
        {button}
        {hasChildren && isExpanded && !active && (
          <div className="space-y-1 mt-1">
            {item.children!.map((child) => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-sidebar/90 backdrop-blur transition-all duration-300',
        active ? 'w-16' : 'w-64',
      )}
    >
      <ScrollArea className="flex-1 px-3 py-4">
        <TooltipProvider delayDuration={0}>
          {!active && (
            <div className="mb-3 rounded-xl border border-border/70 bg-card/70 px-3 py-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {roleConfig.railTitle}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {roleConfig.railDescription}
              </p>
            </div>
          )}
          <div className="space-y-1">
            {items.map((item) => renderNavItem(item))}
          </div>
        </TooltipProvider>
      </ScrollArea>
    </div>
  );
}
