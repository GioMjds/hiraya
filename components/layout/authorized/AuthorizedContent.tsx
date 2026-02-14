'use client';

import type { Route } from 'next';
import { cn } from '@/lib/utils';
import { Header, NavRail } from '@/components/layout';
import type { NavItem, DynamicRouteParams, Roles } from '@/utils/sidebar';
import { resolveDynamicHref } from '@/utils/sidebar';
import { ROLE_UI_CONFIG } from './role-ui-config';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemWithRoute extends Omit<NavItem, 'href' | 'children'> {
  href: Route;
  children?: NavItemWithRoute[];
}

const toLabel = (segment: string): string =>
  segment.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const isLikelyIdentifier = (segment: string): boolean =>
  /^\d+$/.test(segment) ||
  /^[0-9a-f-]{8,}$/i.test(segment) ||
  segment.length > 14;

export const getRoleAction = (
  role: Roles,
  roleEntityID: string | undefined,
  localePrefix: string,
): { label: string; href: string } | null => {
  if (role === 'admin') {
    return { label: 'Review queue', href: `${localePrefix}/admin/reviews` };
  }

  if (!roleEntityID) return null;

  if (role === 'user') {
    return {
      label: 'Open recommendations',
      href: `${localePrefix}/user/${roleEntityID}/recommendations`,
    };
  }

  return {
    label: 'Create posting',
    href: `${localePrefix}/employer/${roleEntityID}/postings/new`,
  };
};

export function AuthorizedContent({
  navItems,
  children,
  role,
  params,
}: {
  navItems: NavItem[];
  children: React.ReactNode;
  role: Roles;
  params?: DynamicRouteParams;
}) {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const roleIndex = segments.lastIndexOf(role);
  const localePrefix =
    roleIndex > 0 ? `/${segments.slice(0, roleIndex).join('/')}` : '';
  
  const roleSegments = roleIndex >= 0 ? segments.slice(roleIndex + 1) : [];
  
  const sectionSegments =
    role === 'admin' ? roleSegments : roleSegments.slice(1);
  
  const primarySection = toLabel(sectionSegments[0] ?? 'dashboard');
  const detailSection =
    sectionSegments[1] && !isLikelyIdentifier(sectionSegments[1])
      ? toLabel(sectionSegments[1])
      : null;

  const roleConfig = ROLE_UI_CONFIG[role];

  const mapNavItems = (items: NavItem[]): NavItemWithRoute[] => {
    return items.map((item) => ({
      ...item,
      href: (item.href
        ? resolveDynamicHref(item.href, params ?? {})
        : '') as Route,
      children: item.children ? mapNavItems(item.children) : undefined,
    }));
  };

  const mappedItems = mapNavItems(navItems);

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background">
      <div
        className={cn(
          'pointer-events-none absolute inset-0 bg-linear-to-br',
          roleConfig.shellBackdropClassName,
        )}
      />
      <header className="w-full shrink-0">
        <Header role={role} />
      </header>
      <div className="relative flex flex-1 overflow-hidden">
        <aside className="border-r shrink-0">
          <NavRail items={mappedItems} role={role} />
        </aside>
        <main
          className={cn(
            'flex-1 overflow-y-auto transition-all duration-300',
            roleConfig.shellContainerClassName,
          )}
        >
          <div className={cn('space-y-6', roleConfig.shellInnerClassName)}>
            <section
              className={cn(
                'rounded-2xl border px-4 py-3 shadow-sm backdrop-blur-sm sm:px-5',
                roleConfig.workspacePanelClassName,
              )}
            >
              <nav className="hidden lg:flex items-center gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
          <BreadcrumbLink href={`${localePrefix}/${role}`} asChild>
            <Link href={`${localePrefix}/${role}` as Route}>
              {roleConfig.workspaceLabel}
            </Link>
          </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
          <BreadcrumbPage>{primarySection}</BreadcrumbPage>
              </BreadcrumbItem>
              {detailSection ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{detailSection}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
              ) : null}
            </BreadcrumbList>
          </Breadcrumb>
        </nav>
            </section>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
