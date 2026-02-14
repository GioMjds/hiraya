import type { ComponentType } from 'react';

export interface EmployerOverviewItem {
  label: string;
  metric:
    | 'activeRolesCount'
    | 'openPostingsCount'
    | 'candidateMatchesCount'
    | 'membersCount';
  icon: ComponentType<{ className?: string }>;
  href: (id: string) => string;
}

export interface EmployerPipelineStage {
  label: string;
  hint: string;
  href: (id: string) => string;
}

export interface EmployerQuickAction {
  title: string;
  description: string;
  href: (id: string) => string;
}