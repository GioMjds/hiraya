import type { Roles } from '@/utils/sidebar';

interface RoleUiConfig {
  railTitle: string;
  railDescription: string;
  workspaceLabel: string;
  workspaceSummary: string;
  searchPlaceholder: string;
  shellContainerClassName: string;
  shellInnerClassName: string;
  shellBackdropClassName: string;
  workspacePanelClassName: string;
  roleBadgeClassName: string;
  navItemActiveClassName: string;
  navItemInactiveClassName: string;
}

export const ROLE_UI_CONFIG: Record<Roles, RoleUiConfig> = {
  user: {
    railTitle: 'Learning Workspace',
    railDescription: 'Track growth from skills to evidence and match readiness.',
    workspaceLabel: 'Growth Hub',
    workspaceSummary:
      'Build stronger role fit by turning your skills into evidence-backed credibility.',
    searchPlaceholder: 'Search skills, evidence, and matches...',
    shellContainerClassName: 'px-4 py-6 sm:px-6 lg:px-8',
    shellInnerClassName: 'mx-auto w-full max-w-6xl',
    shellBackdropClassName: 'from-secondary/60 via-background to-background',
    workspacePanelClassName: 'border-secondary/70 bg-card/90',
    roleBadgeClassName:
      'bg-secondary text-secondary-foreground border-border capitalize font-semibold',
    navItemActiveClassName:
      'bg-secondary text-foreground font-semibold border border-border shadow-sm',
    navItemInactiveClassName:
      'text-muted-foreground hover:text-foreground hover:bg-secondary/70',
  },
  admin: {
    railTitle: 'Governance Console',
    railDescription:
      'Prioritize evidence quality, reviews, and audit visibility in one place.',
    workspaceLabel: 'Operations',
    workspaceSummary:
      'Keep platform trust high with fast triage, consistent governance, and clear audit trails.',
    searchPlaceholder: 'Search reviews, evidence, and audit logs...',
    shellContainerClassName: 'px-4 py-5 sm:px-6 lg:px-8',
    shellInnerClassName: 'w-full',
    shellBackdropClassName:
      'from-primary/10 via-background to-background dark:from-primary/15',
    workspacePanelClassName: 'border-primary/30 bg-card/90',
    roleBadgeClassName:
      'bg-primary text-primary-foreground border-primary capitalize font-semibold',
    navItemActiveClassName:
      'bg-primary text-primary-foreground font-semibold border border-primary shadow-sm',
    navItemInactiveClassName:
      'text-muted-foreground hover:text-foreground hover:bg-secondary/60',
  },
  employer: {
    railTitle: 'Hiring Workspace',
    railDescription:
      'Guide your team from role definition to confident candidate decisions.',
    workspaceLabel: 'Talent Pipeline',
    workspaceSummary:
      'Improve hiring outcomes with clearer role requirements, posting flow, and match reviews.',
    searchPlaceholder: 'Search roles, postings, and candidates...',
    shellContainerClassName: 'px-4 py-6 sm:px-6 lg:px-8',
    shellInnerClassName: 'mx-auto w-full max-w-7xl',
    shellBackdropClassName: 'from-accent/15 via-background to-background',
    workspacePanelClassName: 'border-accent/40 bg-card/90',
    roleBadgeClassName:
      'bg-accent text-accent-foreground border-transparent capitalize font-semibold',
    navItemActiveClassName:
      'bg-secondary text-foreground font-semibold border border-border shadow-sm',
    navItemInactiveClassName:
      'text-muted-foreground hover:text-foreground hover:bg-secondary/60',
  },
};
