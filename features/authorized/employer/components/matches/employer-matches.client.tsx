'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useGetEmployerCandidateMatches } from '@/features/authorized/employer/hooks';
import { ArrowRight, Search, Target } from 'lucide-react';
import type { EmployerRoleCandidateOverviewItem } from '@/lib/api/authorized/employer';
import { EmployerWorkspaceHero } from '../shared/employer-workspace-hero';

interface EmployerMatchesClientProps {
  employerId: string;
}

export function EmployerMatchesClient({
  employerId,
}: EmployerMatchesClientProps) {
  const [isTriageOpen, setIsTriageOpen] = useState<boolean>(false);
  const [minimumScore, setMinimumScore] = useState<string>('70');
  const [triageNote, setTriageNote] = useState<string>('');

  const { data } = useGetEmployerCandidateMatches();

  const roles = Array.isArray(data) ? data : [];
  const candidateTotal = roles.reduce(
    (sum, row) => sum + row.candidateCount,
    0,
  );

  return (
    <div className="space-y-6">
      <EmployerWorkspaceHero
        title="Matches"
        description="Review role-by-role candidate fit and prioritize strongest opportunities quickly."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href={`/employer/${employerId}/dashboard`}>
                Back to dashboard
              </Link>
            </Button>
            <Button onClick={() => setIsTriageOpen(true)}>
              Triage defaults
            </Button>
          </>
        }
        badges={[
          { label: 'Roles', value: roles.length },
          { label: 'Candidates', value: candidateTotal, variant: 'outline' },
          { label: 'Min score', value: `${minimumScore}%`, variant: 'outline' },
        ]}
      />

      <Card className="border-border/80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">Roles</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search roles..." />
          </div>

          <Separator />

          <div className="grid gap-3">
            {roles.length === 0 ? (
              <div className="rounded-lg border border-border/80 p-6 text-sm text-muted-foreground">
                No match-ready roles yet.
              </div>
            ) : (
              roles.map((item: EmployerRoleCandidateOverviewItem) => (
                <div
                  key={item.role.id}
                  className="rounded-lg border border-border/80 p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{item.role.title}</div>
                    <div className="text-xs text-muted-foreground">
                      Role ID: {item.role.id}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Candidates: {item.candidateCount}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`/employer/${employerId}/matches/${item.role.id}`}
                      >
                        Open
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isTriageOpen} onOpenChange={setIsTriageOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Triage defaults</AlertDialogTitle>
            <AlertDialogDescription>
              Configure default shortlist thresholds for match review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="minimum-score">Minimum shortlist score</Label>
              <Input
                id="minimum-score"
                type="number"
                min={0}
                max={100}
                value={minimumScore}
                onChange={(event) => setMinimumScore(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="triage-note">Triage note</Label>
              <Input
                id="triage-note"
                placeholder="Add a reminder for your team"
                value={triageNote}
                onChange={(event) => setTriageNote(event.target.value)}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </AlertDialogCancel>
              <Button type="button" onClick={() => setIsTriageOpen(false)}>
                Save defaults
              </Button>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
