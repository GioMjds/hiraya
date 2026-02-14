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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useGetEmployerCandidateMatches } from '@/features/authorized/employer/hooks';
import { CheckCircle2, Gauge, Target } from 'lucide-react';
import { EmployerWorkspaceHero } from '../shared/employer-workspace-hero';

interface EmployerRoleMatchesClientProps {
  employerId: string;
  roleId: string;
}

type TriageDecision = 'shortlist' | 'review' | 'reject';

export function EmployerRoleMatchesClient({
  employerId,
  roleId,
}: EmployerRoleMatchesClientProps) {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [decision, setDecision] = useState<TriageDecision>('review');
  const [note, setNote] = useState<string>('');
  const [triaged, setTriaged] = useState<
    Record<string, { decision: TriageDecision; note: string }>
  >({});

  const { data: result } = useGetEmployerCandidateMatches(roleId);

  const roleMatches = Array.isArray(result) ? null : result;

  const selectedMatch =
    roleMatches?.matches.find((match) => match.id === selectedMatchId) ?? null;

  const openTriage = (matchId: string) => {
    setSelectedMatchId(matchId);
    setDecision(triaged[matchId]?.decision ?? 'review');
    setNote(triaged[matchId]?.note ?? '');
  };

  const handleSaveTriage = () => {
    if (!selectedMatchId) return;
    setTriaged((prev) => ({
      ...prev,
      [selectedMatchId]: { decision, note: note.trim() },
    }));
    setSelectedMatchId(null);
    setDecision('review');
    setNote('');
  };

  return (
    <div className="space-y-6">
      <EmployerWorkspaceHero
        title="Role matches"
        description="Review candidate fit for this role and shortlist with consistent criteria."
        actions={
          <Button variant="outline" asChild>
            <Link href={`/employer/${employerId}/matches`}>
              Back to matches
            </Link>
          </Button>
        }
        badges={[
          { label: 'Role ID', value: roleId },
          {
            label: 'Candidates',
            value: roleMatches?.matches.length ?? 0,
            variant: 'outline',
          },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Candidates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {roleMatches && roleMatches.matches.length > 0 ? (
              roleMatches.matches.map((match) => (
                <div key={match.id} className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">
                      {match.user?.fullName ?? match.userId}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {Math.round(match.score)}%
                      </Badge>
                      {triaged[match.id] && (
                        <Badge variant="secondary" className="uppercase">
                          {triaged[match.id].decision}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {match.user?.email ?? 'Unknown email'}
                  </div>
                  {triaged[match.id]?.note && (
                    <div className="text-xs text-muted-foreground rounded-md border border-dashed p-2">
                      {triaged[match.id].note}
                    </div>
                  )}
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openTriage(match.id)}
                    >
                      Triage
                    </Button>
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

      <AlertDialog
        open={Boolean(selectedMatchId)}
        onOpenChange={(open) => {
          if (!open) setSelectedMatchId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Candidate triage</AlertDialogTitle>
            <AlertDialogDescription>
              Record shortlist decisions and rationale for this candidate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            <div className="rounded-lg border p-3 text-sm">
              <div className="font-medium">
                {selectedMatch?.user?.fullName ?? selectedMatch?.userId}
              </div>
              <div className="text-muted-foreground">
                Score:{' '}
                {selectedMatch ? `${Math.round(selectedMatch.score)}%` : 'N/A'}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Decision</Label>
              <Select
                value={decision}
                onValueChange={(value) => setDecision(value as TriageDecision)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shortlist">Shortlist</SelectItem>
                  <SelectItem value="review">Needs review</SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="triage-note">Note</Label>
              <Input
                id="triage-note"
                placeholder="Reason for decision"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </AlertDialogCancel>
              <Button type="button" onClick={handleSaveTriage}>
                Save triage
              </Button>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
