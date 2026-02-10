'use client';

import { useEffect, useState } from 'react';
import { Bell, Search, Menu, PanelLeftClose } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ThemeToggle from '@/components/shared/theme-switcher';
import { useNavRailStore } from '@/stores';
import { AuthorizedProfile } from './authorized';

interface HeaderProps {
  role: string;
}

export function Header({ role }: HeaderProps) {
  const { isCollapsed, toggleCollapse } = useNavRailStore();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const active = mounted ? isCollapsed : false;

  return (
    <div className="h-16 border-b px-4 flex items-center justify-between bg-background">
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

        <div className="font-bold text-xl tracking-tight hidden md:block">
          Praktisan
        </div>
        <Separator orientation="vertical" className="h-6 hidden md:block" />
        <Badge variant="outline" className="capitalize">
          {role}
        </Badge>
      </div>

      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search everything..."
            className="pl-9 h-9 w-full rounded-full bg-muted/50 focus-visible:bg-background"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
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
