import type { Route } from 'next';
import {
  Briefcase,
  FileText,
  Target,
  Users,
} from 'lucide-react';
import type {
  EmployerOverviewItem,
  EmployerPipelineStage,
  EmployerQuickAction,
} from '@/features/authorized/employer/types';

export const EMPLOYER_OVERVIEW_ITEMS = [
  {
    label: 'Active roles',
    metric: 'activeRolesCount',
    icon: Briefcase,
    href: (id: string) => `/employer/${id}/roles` as Route,
  },
  {
    label: 'Open postings',
    metric: 'openPostingsCount',
    icon: FileText,
    href: (id: string) => `/employer/${id}/postings` as Route,
  },
  {
    label: 'Candidates matched',
    metric: 'candidateMatchesCount',
    icon: Target,
    href: (id: string) => `/employer/${id}/matches` as Route,
  },
  {
    label: 'Organization members',
    metric: 'membersCount',
    icon: Users,
    href: (id: string) => `/employer/${id}/org/members` as Route,
  },
] satisfies EmployerOverviewItem[];

export const EMPLOYER_PIPELINE_STAGES = [
  {
    label: 'Define role requirements',
    hint: 'Set capability and skill expectations.',
    href: (id: string) => `/employer/${id}/roles` as Route,
  },
  {
    label: 'Publish and track postings',
    hint: 'Open a posting tied to the role profile.',
    href: (id: string) => `/employer/${id}/postings` as Route,
  },
  {
    label: 'Review role matches',
    hint: 'Evaluate candidates using fit and gaps.',
    href: (id: string) => `/employer/${id}/matches` as Route,
  },
] satisfies EmployerPipelineStage[];

export const EMPLOYER_QUICK_ACTIONS = [
  {
    title: 'Create a role definition',
    description: 'Add required skills and capability levels.',
    href: (id: string) => `/employer/${id}/roles` as Route,
  },
  {
    title: 'Publish a job posting',
    description: 'Open a posting tied to a role.',
    href: (id: string) => `/employer/${id}/postings/new` as Route,
  },
  {
    title: 'Review match results',
    description: 'See candidate fit scores for a role.',
    href: (id: string) => `/employer/${id}/matches` as Route,
  },
] satisfies EmployerQuickAction[];