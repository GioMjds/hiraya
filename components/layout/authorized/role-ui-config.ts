import type { Roles } from '@/utils/sidebar';

interface RoleUiConfig {
  railTitle: string;
  workspaceLabel: string;
  searchPlaceholder: string;
  shellContainerClassName: string;
  shellInnerClassName: string;
  roleBadgeClassName: string;
  navItemActiveClassName: string;
  navItemInactiveClassName: string;
}

export const ROLE_UI_CONFIG: Record<Roles, RoleUiConfig> = {
  user: {
    railTitle: 'Learning Workspace',
    workspaceLabel: 'Growth Hub',
    searchPlaceholder: 'Search skills, evidence, and matches...',
    shellContainerClassName: 'px-4 py-6 sm:px-6 lg:px-8',
    shellInnerClassName: 'mx-auto w-full max-w-6xl',
    roleBadgeClassName:
      'bg-secondary text-secondary-foreground border-border capitalize font-semibold',
    navItemActiveClassName:
      'bg-secondary text-foreground font-semibold border border-border',
    navItemInactiveClassName: 'text-muted-foreground hover:text-foreground',
  },
  admin: {
    railTitle: 'Governance Console',
    workspaceLabel: 'Operations',
    searchPlaceholder: 'Search reviews, evidence, and audit logs...',
    shellContainerClassName: 'px-4 py-5 sm:px-6 lg:px-8',
    shellInnerClassName: 'w-full',
    roleBadgeClassName:
      'bg-primary text-primary-foreground border-primary capitalize font-semibold',
    navItemActiveClassName:
      'bg-primary text-primary-foreground font-semibold border border-primary',
    navItemInactiveClassName: 'text-muted-foreground hover:text-foreground',
  },
  employer: {
    railTitle: 'Hiring Workspace',
    workspaceLabel: 'Talent Pipeline',
    searchPlaceholder: 'Search roles, postings, and candidates...',
    shellContainerClassName: 'px-4 py-6 sm:px-6 lg:px-8',
    shellInnerClassName: 'mx-auto w-full max-w-7xl',
    roleBadgeClassName:
      'bg-accent text-accent-foreground border-transparent capitalize font-semibold',
    navItemActiveClassName:
      'bg-secondary text-foreground font-semibold border border-border',
    navItemInactiveClassName: 'text-muted-foreground hover:text-foreground',
  },
};