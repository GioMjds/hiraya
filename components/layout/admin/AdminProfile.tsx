'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Loader2, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PROFILE_DROPDOWN_ITEMS } from '@/features/admin/consts';
import { useUser } from '@/features/identity/auth/hooks';
import { useLogout } from '@/repositories/identity/auth';

export function AdminProfile() {
  const [mounted, isMounted] = useState<boolean>(false);

  const { data, isLoading } = useUser();

  const logoutMutation = useLogout();

  useEffect(() => {
    const raf = requestAnimationFrame(() => isMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const displayName = data
    ? `${data.firstName} ${data.lastName}`
    : 'Guest User';

  const displayEmail = data?.email ?? '';

  const initials =
    `${data?.firstName.charAt(0)}${data?.lastName.charAt(0)}`.toUpperCase();

  if (!mounted) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              {data && <AvatarFallback>{initials}</AvatarFallback>}
            </Avatar>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {displayEmail}
            </p>
          </div>
          <Separator />
          <div className="grid gap-1">
            {PROFILE_DROPDOWN_ITEMS.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="justify-start h-8 px-2 font-normal"
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                {item.label}
              </Button>
            ))}
          </div>
          <Separator />
          <Button
            variant="ghost"
            onClick={() => logoutMutation.mutate()}
            className="justify-start h-8 px-2 font-normal text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
