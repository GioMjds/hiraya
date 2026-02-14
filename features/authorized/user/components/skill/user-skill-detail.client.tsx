'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, CheckCircle2, Sparkles, Target } from 'lucide-react';
import { useGetUserEvidence, useGetUserSkills } from '@/features/authorized/user/hooks';

interface UserSkillDetailClientProps {
  userId: string;
  skillId: string;
}

const toTitle = (value: string) =>
  value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export function UserSkillDetailClient({
  userId,
  skillId,
}: UserSkillDetailClientProps) {
  const { data: skills, isLoading: isLoadingSkills } = useGetUserSkills();
  const { data: evidenceData, isLoading: isLoadingEvidence } = useGetUserEvidence();
  const skill = skills?.find((item) => item.id === skillId);

  const relatedEvidence = useMemo(() => {
    if (!evidenceData) return [];
    return evidenceData.filter((evidence) =>
      evidence.skillLinks.some((linkedSkill) => linkedSkill.id === skillId),
    );
  }, [evidenceData, skillId]);

  const isLoading = isLoadingSkills || isLoadingEvidence;
  const confidence = Math.max(0, Math.min(skill?.confidence ?? 0, 100));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Skill detail</h1>
          <p className="text-sm text-muted-foreground">
            View proficiency and linked evidence.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/user/${userId}/skills`}>Back to skills</Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                Loading skill details...
              </div>
            ) : (
              <>
                <div className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="text-sm text-muted-foreground">Skill</div>
                      <div className="text-lg font-semibold">
                        {skill?.skill?.name ?? 'Skill data unavailable'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="uppercase">
                        {skill ? toTitle(skill.level) : 'N/A'}
                      </Badge>
                      {skill?.isPrimary && <Badge variant="outline">Primary</Badge>}
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Confidence</div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${Math.max(0, Math.min(skill?.confidence ?? 0, 100))}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {skill ? `${skill.confidence}% confidence` : 'No confidence data yet.'}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <div className="text-sm font-medium">Linked evidence</div>
                  {relatedEvidence.length > 0 ? (
                    relatedEvidence.map((evidence) => (
                      <Link
                        key={evidence.id}
                        href={`/user/${userId}/evidence/${evidence.id}`}
                        className="block rounded-lg border p-3 text-sm hover:bg-muted/40"
                      >
                        <div className="font-medium">{evidence.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {toTitle(evidence.type)}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                      No evidence linked to this skill yet.
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progress context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border p-3 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Readiness</div>
              <Badge variant={confidence >= 70 ? 'secondary' : 'outline'}>
                {confidence >= 70 ? 'Strong' : 'Growing'}
              </Badge>
            </div>
            <div className="rounded-lg border p-3 text-sm text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Linked evidence: {relatedEvidence.length}
            </div>
            <div className="rounded-lg border p-3 text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Confidence: {confidence}%
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">User Skill ID</div>
              <div className="font-mono text-sm">{skillId}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Skill ID</div>
              <div className="font-mono text-sm">{skill?.skillId ?? 'N/A'}</div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Next action
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/user/${userId}/evidence`}>
                  Add supporting evidence
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
