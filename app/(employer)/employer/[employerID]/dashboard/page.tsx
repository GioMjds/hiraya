import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  FileText,
  Gauge,
  Target,
  Users,
} from 'lucide-react';
import type { Route } from 'next';

interface OverviewItem {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  href: (id: string) => Route;
}

const OVERVIEW = [
  {
    label: 'Active roles',
    value: '—',
    icon: Briefcase,
    href: (id: string) => `/employer/${id}/roles` as Route,
  },
  {
    label: 'Open postings',
    value: '—',
    icon: FileText,
    href: (id: string) => `/employer/${id}/postings` as Route,
  },
  {
    label: 'Candidates matched',
    value: '—',
    icon: Target,
    href: (id: string) => `/employer/${id}/matches` as Route,
  },
  {
    label: 'Organization members',
    value: '—',
    icon: Users,
    href: (id: string) => `/employer/${id}/org/members` as Route,
  },
] satisfies OverviewItem[];

const PIPELINE_STAGES: Array<{
  label: string;
  hint: string;
  href: (id: string) => Route;
}> = [
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
];

export default async function Page({
  params,
}: PageProps<'/employer/[employerID]/dashboard'>) {
  const { employerID } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Employer Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Create roles, publish postings, and review candidate matches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/employer/${employerID}/org`}>
              <Building2 className="mr-1 h-4 w-4" />
              Organization
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/employer/${employerID}/postings/new`}>
              New posting
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {OVERVIEW.map((item) => (
          <Card key={item.label} className="hover:shadow-sm transition-shadow border-border/80">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-semibold">{item.value}</div>
              <Button variant="ghost" size="sm" className="px-0" asChild>
                <Link href={item.href(employerID)}>
                  Open
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/80 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Hiring pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {PIPELINE_STAGES.map((stage, index) => (
                <div
                  key={stage.label}
                  className="rounded-lg border border-border/80 p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="font-medium">Stage {index + 1}: {stage.label}</div>
                    <div className="text-sm text-muted-foreground">{stage.hint}</div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={stage.href(employerID)}>Open</Link>
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            {[
              {
                title: 'Create a role definition',
                description: 'Add required skills and capability levels.',
                href: `/employer/${employerID}/roles`,
              },
              {
                title: 'Publish a job posting',
                description: 'Open a posting tied to a role.',
                href: `/employer/${employerID}/postings/new`,
              },
              {
                title: 'Review match results',
                description: 'See candidate fit scores for a role.',
                href: `/employer/${employerID}/matches`,
              },
            ].map((row) => (
              <div
                key={row.title}
                className="rounded-lg border border-border/80 p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-medium">{row.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {row.description}
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={row.href}>Open</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="text-base">Organization status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Plan</div>
              <Badge variant="outline">Mock</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Pipeline health</div>
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Stable
              </Badge>
            </div>
            <Separator />
            <div className="rounded-lg border border-border/80 p-4">
              <div className="text-sm font-medium">Tip</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Improve match quality by keeping role requirements specific and
                evidence-driven.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
