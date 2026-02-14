import type { Metadata, Route } from 'next';
import { getNavForRole } from '@/utils';
import { AuthorizedContent } from '@/components/layout/authorized';
import { enforceRoleSession } from '@/lib/auth/route-session';

export const metadata: Metadata = {
  title: 'Your Dashboard - Hiraya',
  description:
    "Hiraya's user dashboard where you can manage your account and view your activity.",
};

export default async function Layout({
  children,
  params,
}: LayoutProps<'/employer/[employerID]'>) {
  const resolvedParams = await params;
  await enforceRoleSession({
    expectedRole: 'employer',
    routeUserId: resolvedParams.employerID,
  });

  const navItems = getNavForRole('employer').map((i) => ({
    ...i,
    href: i.href as Route,
  }));

  return (
    <AuthorizedContent
      role="employer"
      navItems={navItems}
      params={{ employerID: resolvedParams.employerID }}
    >
      {children}
    </AuthorizedContent>
  );
}
