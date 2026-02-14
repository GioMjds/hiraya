'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetEmployerCandidateMatches } from '@/features/authorized/employer/hooks';
import { CheckCircle2, Gauge, Target } from 'lucide-react';

interface EmployerRoleMatchesClientProps {
  employerId: string;
  roleId: string;
}

export function EmployerRoleMatchesClient({
  employerId,
  roleId,
}: EmployerRoleMatchesClientProps) {
  const { data: result } = useGetEmployerCandidateMatches(roleId);
  const roleMatches = Array.isArray(result) ? null : result;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Role matches
          </h1>
          <p className="text-sm text-muted-foreground">
            Candidate fit scores for a specific role.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/employer/${employerId}/matches`}>Back to matches</Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Candidates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {roleMatches && roleMatches.matches.length > 0 ? (
              roleMatches.matches.map((match) => (
                <div key={match.id} className="rounded-lg border p-4 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">
                      {match.user?.fullName ?? match.userId}
                    </div>
                    <Badge variant="outline">{Math.round(match.score)}%</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {match.user?.email ?? 'Unknown email'}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                No candidate matches yet.
              </div>
            )}
            <div className="rounded-lg border p-4 text-sm text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Shortlist candidates with stronger evidence-backed capability fit
              first.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Role context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border p-3 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Match health</div>
              <Badge variant="outline">
                {roleMatches
                  ? `${roleMatches.matches.length} candidates`
                  : 'Tracking'}
              </Badge>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium">Role ID</div>
              <div className="mt-1 font-mono text-sm">{roleId}</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium">Shortlist criteria</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Area for minimum score, critical requirements, and evidence
                requirements.
              </div>
            </div>
            <Separator />
            <div className="rounded-lg border p-3 text-sm text-muted-foreground flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Maintain consistent shortlist thresholds across hiring cycles.
            </div>
            <div className="rounded-lg border p-3 text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Capture selection rationale for auditability.
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/employer/${employerId}/roles/${roleId}`}>
                Open role details
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
