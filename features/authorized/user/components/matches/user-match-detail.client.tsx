'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Sparkles, Target } from 'lucide-react';
import { useGetUserMatchById } from '@/features/authorized/user/hooks';

interface UserMatchDetailClientProps {
  userId: string;
  matchId: string;
}

export function UserMatchDetailClient({
  userId,
  matchId,
}: UserMatchDetailClientProps) {
  const { data, isLoading } = useGetUserMatchById(matchId);

  const score = Math.round(data?.score ?? 0);
  const gapCount = data?.gaps?.length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Match detail
          </h1>
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
            {isLoading ? (
              <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                Loading match details...
              </div>
            ) : (
              <>
                <div className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="text-lg font-bold">
                        {data?.role?.title}
                      </div>
                    </div>
                    <Badge variant="outline">{score}%</Badge>
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${Math.max(0, Math.min(score, 100))}%`,
                        }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Match confidence: {score}%
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-2">
                  <div className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Suggested next action
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Review your top capability gaps and strengthen the
                    highest-impact missing area first.
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/user/${userId}/recommendations`}>
                      Open Recommendations
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Skill gaps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <div className="text-muted-foreground">Gap count</div>
              <Badge variant="outline">{gapCount}</Badge>
            </div>
            {data?.gaps && data.gaps.length > 0 ? (
              data.gaps.map((gap) => (
                <div key={gap.id} className="rounded-lg border p-3 text-sm">
                  <h1 className="text-muted-foreground">
                    Required: {gap.requiredLevel}
                  </h1>
                  <h1 className='text-muted-foreground'>
                    Current: {gap.currentLevel}
                  </h1>
                  <div className="text-muted-foreground">
                    Gap score: {Math.round(gap.gapScore)}%
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border p-3 text-sm text-muted-foreground">
                No skill gaps available yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
