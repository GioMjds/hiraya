'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetUserSkills } from '@/features/authorized/user/hooks';

interface UserSkillDetailClientProps {
  userId: string;
  skillId: string;
}

export function UserSkillDetailClient({ userId, skillId }: UserSkillDetailClientProps) {
  const { data } = useGetUserSkills();
  const skill = data?.find((item) => item.id === skillId);

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
            <div className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-sm text-muted-foreground">Skill</div>
                  <div className="text-lg font-semibold">
                    {skill?.skill?.name ?? 'Skill data unavailable'}
                  </div>
                </div>
                <Badge variant="secondary" className="uppercase">
                  {skill?.level ?? 'N/A'}
                </Badge>
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
              <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                Link is managed in evidence detail records.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">User Skill ID</div>
              <div className="font-mono text-sm">{skillId}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Skill ID</div>
              <div className="font-mono text-sm">{skill?.skillId ?? 'N/A'}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
