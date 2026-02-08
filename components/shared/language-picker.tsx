'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Route } from 'next';

const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'fil', label: 'Filipino', nativeLabel: 'Tagalog' },
];

export default function LanguagePickerDropdown() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!mounted) return null;

  const currentLocale = pathname.split('/')[1] || 'en';

  const getLocalizedPath = (locale: string): Route => {
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/') as Route;
  }

  const switchLanguage = (locale: string) => {
    startTransition(() => {
      const segments = getLocalizedPath(locale);
      router.push(segments);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9"
          disabled={isPending}
          aria-label="Change language"
        >
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => switchLanguage(language.code)}
            className="cursor-pointer"
            disabled={isPending || language.code === currentLocale}
          >
            <span className="flex flex-col">
              <span className="text-sm font-medium">{language.label}</span>
              <span className="text-xs text-muted-foreground">
                {language.nativeLabel}
              </span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}