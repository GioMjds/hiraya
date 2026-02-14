'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  EMPLOYER_OVERVIEW_ITEMS,
  EMPLOYER_PIPELINE_STAGES,
  EMPLOYER_QUICK_ACTIONS,
} from '@/features/authorized/employer/consts';
import { useGetEmployerDashboard } from '@/features/authorized/employer/hooks';
import { ArrowRight, Building2, CheckCircle2, Gauge } from 'lucide-react';
import { EmployerWorkspaceHero } from '../shared/employer-workspace-hero';

interface EmployerDashboardClientProps {
  employerId: string;
}

export function EmployerDashboardClient({
  employerId,
}: EmployerDashboardClientProps) {
  const { data } = useGetEmployerDashboard();

  return (
    <div className="space-y-6">
      <EmployerWorkspaceHero
        title="Employer Dashboard"
        description="Create roles, publish postings, and review candidate matches with clear pipeline visibility."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href={`/employer/${employerId}/org`}>
                <Building2 className="mr-1 h-4 w-4" />
                Organization
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/employer/${employerId}/postings/new`}>
                New posting
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </>
        }
        badges={[
          { label: 'Active roles', value: data?.metrics.activeRolesCount ?? 0 },
          { label: 'Open postings', value: data?.metrics.openPostingsCount ?? 0, variant: 'outline' },
          {
            label: 'Candidate matches',
            value: data?.metrics.candidateMatchesCount ?? 0,
            variant: 'outline',
          },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {EMPLOYER_OVERVIEW_ITEMS.map((item) => (
          <Card
            key={item.label}
            className="hover:shadow-sm transition-shadow border-border/80"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-semibold">
                {data?.metrics[item.metric] ?? 0}
              </div>
              <Button variant="ghost" size="sm" className="px-0" asChild>
                <Link href={item.href(employerId) as Route}>
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
              {EMPLOYER_PIPELINE_STAGES.map((stage, index) => (
                <div
                  key={stage.label}
                  className="rounded-lg border border-border/80 p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="font-medium">
                      Stage {index + 1}: {stage.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stage.hint}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={stage.href(employerId) as Route}>Open</Link>
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            {EMPLOYER_QUICK_ACTIONS.map((row) => (
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
                  <Link href={row.href(employerId) as Route}>Open</Link>
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
              <div className="text-sm text-muted-foreground">
                Pipeline health
              </div>
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
