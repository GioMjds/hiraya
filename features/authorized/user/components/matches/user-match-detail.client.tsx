'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { useGetUserMatchById } from '@/features/authorized/user/hooks';

interface UserMatchDetailClientProps {
  userId: string;
  matchId: string;
}

export function UserMatchDetailClient({
  userId,
  matchId,
}: UserMatchDetailClientProps) {
  const { data } = useGetUserMatchById(matchId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Match detail</h1>
          <p className="text-sm text-muted-foreground">
            Explanation summary and prioritized gaps.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/user/${userId}/matches`}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Fit explanation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-sm text-muted-foreground">Role</div>
                  <div className="text-lg font-semibold">
                    {data?.role?.title ?? 'Role data unavailable'}
                  </div>
                </div>
                <Badge variant="outline">{Math.round(data?.score ?? 0)}%</Badge>
              </div>
              <Separator className="my-4" />
              <div className="text-sm text-muted-foreground">
                {data?.explanationSummary ?? 'No explanation summary available.'}
              </div>
            </div>

            <div className="rounded-lg border p-4 text-sm text-muted-foreground">
              Algorithm version: {data?.algorithmVersion ?? 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skill gaps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data?.gaps && data.gaps.length > 0 ? (
              data.gaps.map((gap) => (
                <div key={gap.id} className="rounded-lg border p-3 text-sm">
                  <div className="font-medium">Capability: {gap.capabilityId ?? 'N/A'}</div>
                  <div className="text-muted-foreground">
                    Required: {gap.requiredLevel} • Current: {gap.currentLevel ?? 'none'}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border p-3 text-sm text-muted-foreground">
                No skill gaps available yet.
              </div>
            )}
            <Separator />
            <div className="text-xs text-muted-foreground">Match ID: {matchId}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
