export type NavItem = {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  children?: NavItem[];
  roles?: string[];
};

export type DynamicRouteParams = {
  userID?: string;
  employerID?: string;
  roleID?: string;
  postingID?: string;
  evidenceID?: string;
  matchID?: string;
  skillID?: string;
  reviewID?: string;
};

export type Roles = 'admin' | 'user' | 'employer';

export const ROLE_NAV_ITEMS: Record<string, NavItem[]> = {
  admin: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/',
      icon: 'Home',
    },
    {
      id: 'reviews',
      label: 'Reviews',
      href: '/reviews',
      icon: 'FileText',
    },
    {
      id: 'evidence',
      label: 'Evidence',
      href: '/evidence',
      icon: 'FolderCheck',
    },
    {
      id: 'skills',
      label: 'Skills',
      href: '/skills',
      icon: 'Sparkles',
    },
    {
      id: 'capabilities',
      label: 'Capabilities',
      href: '/capabilities',
      icon: 'Network',
    },
    {
      id: 'audit',
      label: 'Audit',
      href: '/audit',
      icon: 'ShieldCheck',
    },
  ],
  user: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/[userID]/dashboard',
      icon: 'Home',
    },
    {
      id: 'profile',
      label: 'Profile',
      href: '/[userID]/profile',
      icon: 'User',
    },
    {
      id: 'skills',
      label: 'Skills',
      href: '/[userID]/skills',
      icon: 'Sparkles',
    },
    {
      id: 'evidence',
      label: 'Evidence',
      href: '/[userID]/evidence',
      icon: 'FolderCheck',
    },
    {
      id: 'matches',
      label: 'Matches',
      href: '/[userID]/matches',
      icon: 'Target',
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      href: '/[userID]/recommendations',
      icon: 'Lightbulb',
    },
  ],
  employer: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/[employerID]/dashboard',
      icon: 'Home',
    },
    {
      id: 'organization',
      label: 'Organization',
      href: '/[employerID]/org',
      icon: 'Building2',
    },
    {
      id: 'members',
      label: 'Members',
      href: '/[employerID]/org/members',
      icon: 'Users',
    },
    {
      id: 'roles',
      label: 'Roles',
      href: '/[employerID]/roles',
      icon: 'Briefcase',
    },
    {
      id: 'postings',
      label: 'Postings',
      href: '/[employerID]/postings',
      icon: 'FileText',
    },
    {
      id: 'matches',
      label: 'Matches',
      href: '/[employerID]/matches',
      icon: 'Target',
    },
  ],
};

export function getNavForRole(role: Roles): NavItem[] {
  return ROLE_NAV_ITEMS[role] ?? [];
}

export function resolveDynamicHref(
  href: string,
  params: DynamicRouteParams,
): string {
  return href
    .replace('[userID]', params.userID ?? '')
    .replace('[employerID]', params.employerID ?? '')
    .replace('[roleID]', params.roleID ?? '')
    .replace('[postingID]', params.postingID ?? '')
    .replace('[evidenceID]', params.evidenceID ?? '')
    .replace('[matchID]', params.matchID ?? '')
    .replace('[skillID]', params.skillID ?? '')
    .replace('[reviewID]', params.reviewID ?? '');
}