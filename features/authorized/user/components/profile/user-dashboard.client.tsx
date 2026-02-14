'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Sparkles,
  Target,
} from 'lucide-react';
import { QUICK_ACTIONS } from '@/features/authorized/user';
import { useGetDashboard } from '@/features/authorized/user/hooks';

interface UserDashboardClientProps {
  userId: string;
}

export function UserDashboardClient({ userId }: UserDashboardClientProps) {
  const { data } = useGetDashboard();
  const hasEvidence = (data?.metrics.evidenceCount ?? 0) > 0;
  const hasMatches = (data?.metrics.matchesCount ?? 0) > 0;

  const stats = [
    {
      label: 'Skill coverage',
      value: String(data?.metrics.skillsCount ?? 0),
      note: 'Skills you declared',
    },
    {
      label: 'Evidence count',
      value: String(data?.metrics.evidenceCount ?? 0),
      note: 'Artifacts submitted',
    },
    {
      label: 'Matches generated',
      value: String(data?.metrics.matchesCount ?? 0),
      note: 'Role fit results',
    },
    {
      label: 'Top match score',
      value: `${Math.round(data?.metrics.topMatchScore ?? 0)}%`,
      note: 'Best current role fit',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Evidence-backed skills, capability matching, and next best actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/user/${userId}/recommendations`}>
              Recommendations
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/user/${userId}/matches`}>
              Open matches
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-2xl font-semibold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.note}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/80 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Compass className="h-4 w-4" />
              Growth journey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Step 1</div>
                  <Badge variant={data?.user ? 'secondary' : 'outline'}>
                    {data?.user ? 'Done' : 'Pending'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Complete your profile baseline.
                </div>
              </div>
              <div className="rounded-lg border border-border/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Step 2</div>
                  <Badge variant={hasEvidence ? 'secondary' : 'outline'}>
                    {hasEvidence ? 'Done' : 'Pending'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Attach evidence for your strongest skills.
                </div>
              </div>
              <div className="rounded-lg border border-border/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Step 3</div>
                  <Badge variant={hasMatches ? 'secondary' : 'outline'}>
                    {hasMatches ? 'Done' : 'Pending'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Compute role matches and review gaps.
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-3 sm:grid-cols-2">
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.title}
                  variant="outline"
                  className="h-auto justify-start p-4"
                  asChild
                >
                  <Link href={action.href(userId)}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-md border border-border/80 bg-background p-2">
                        <action.icon className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Next milestone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Readiness</div>
              <Badge variant={data?.user ? 'secondary' : 'outline'}>
                {data?.user ? 'Ready' : 'No data'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Top score</div>
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {Math.round(data?.metrics.topMatchScore ?? 0)}%
              </Badge>
            </div>
            <Separator />
            <div className="rounded-lg border border-border/80 p-4">
              <div className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Suggested next step
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Add at least one piece of evidence to strengthen your top
                skills.
              </div>
              <Button size="sm" className="mt-3" asChild>
                <Link href={`/user/${userId}/evidence`}>Add evidence</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
