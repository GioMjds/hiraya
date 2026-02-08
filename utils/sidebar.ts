export type NavItem = {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  children?: NavItem[];
  roles?: string[];
};

export const ROLE_NAV_ITEMS: Record<string, NavItem[]> = {
  admin: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/admin',
      icon: 'Home',
    },
    {
      id: 'users',
      label: 'Users',
      href: '/admin/users',
      icon: 'Users',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      href: '/admin/analytics',
      icon: 'BarChart3',
    },
    {
      id: 'reports',
      label: 'Reports',
      href: '/admin/reports',
      icon: 'FileText',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'Settings',
      children: [
        {
          id: 'accessibility',
          label: 'Accessibility',
          href: '/admin/settings/accessibility',
          icon: 'Eye',
        },
        {
          id: 'activity',
          label: 'Activity',
          href: '/admin/settings/activity',
          icon: 'Activity',
        },
        {
          id: 'account-controls',
          label: 'Account Controls',
          href: '/admin/settings/controls',
          icon: 'Lock',
        },
        {
          id: 'customizations',
          label: 'Customizations',
          href: '/admin/settings/customizations',
          icon: 'Palette',
        },
        {
          id: 'data-ownership',
          label: 'Data Ownership',
          href: '/admin/settings/data',
          icon: 'Database',
        },
        {
          id: 'notification',
          label: 'Notifications',
          href: '/admin/settings/notification',
          icon: 'Bell',
        },
        {
          id: 'privacy',
          label: 'Privacy',
          href: '/admin/settings/privacy',
          icon: 'Shield',
        },
        {
          id: 'security',
          label: 'Security',
          href: '/admin/settings/security',
          icon: 'Lock',
        },
      ],
    },
  ],
  staff: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/staff',
      icon: 'Home',
    },
    {
      id: 'reports',
      label: 'Reports',
      href: '/staff/reports',
      icon: 'FileText',
    },
  ],
};

export function getNavForRole(role: string): NavItem[] {
  return ROLE_NAV_ITEMS[role];
}
