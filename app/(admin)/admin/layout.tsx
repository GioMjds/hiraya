import type { Metadata, Route } from 'next';
import { getNavForRole } from '@/utils';
import { AuthorizedContent } from '@/components/layout/authorized';
import { enforceRoleSession } from '@/lib/auth/route-session';

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard - Hiraya',
    template: '%s - Hiraya',
  },
  description:
    "Hiraya's user dashboard where you can manage your account and view your activity.",
};

export default async function Layout({ children }: LayoutProps<'/admin'>) {
  await enforceRoleSession({ expectedRole: 'admin' });

  const navItems = getNavForRole('admin').map((i) => ({
    ...i,
    href: i.href as Route,
  }));

  return (
    <AuthorizedContent role="admin" navItems={navItems}>
      {children}
    </AuthorizedContent>
  );
}
