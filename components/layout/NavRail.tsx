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

interface NavItemBase {
  id: string;
  label: string;
  href: Route;
  icon?: string;
  children?: NavItemBase[];
}

interface NavRailProps {
  items: readonly NavItemBase[];
}

export function NavRail({ items }: NavRailProps) {
  const pathname = usePathname();
  const { isCollapsed } = useNavRailStore();
  const [mounted, setMounted] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

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

  const isPathActive = (href: Route): boolean => {
    const localizedHref = getLocalizedHref(href);
    return pathname === localizedHref;
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
    const isExpanded = expandedItems.has(item.id);
    const parentIsActive = isParentActive(item.children);

    const button = (
      <Button
        key={item.id}
        asChild={!hasChildren}
        variant={isActive ? 'secondary' : 'ghost'}
        className={cn(
          'w-full justify-start transition-all duration-200',
          isActive || parentIsActive
            ? 'bg-white shadow-sm dark:bg-zinc-800 font-semibold text-primary'
            : 'text-muted-foreground hover:text-foreground',
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
          <Link href={localizedHref} className="flex items-center gap-3 w-full">
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

    if (active && !hasChildren) {
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
        'flex flex-col h-full bg-zinc-50/50 dark:bg-zinc-900/50 transition-all duration-300',
        active ? 'w-16' : 'w-64',
      )}
    >
      <ScrollArea className="flex-1 px-3 py-4">
        <TooltipProvider delayDuration={0}>
          <div className="space-y-1">
            {items.map((item) => renderNavItem(item))}
          </div>
        </TooltipProvider>
      </ScrollArea>
    </div>
  );
}
