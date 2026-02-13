'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Target } from 'lucide-react';
import {
  useComputeUserMatches,
  useGetUserMatches,
} from '@/features/authorized/user/hooks';

interface UserMatchesClientProps {
  userId: string;
}

export function UserMatchesClient({ userId }: UserMatchesClientProps) {
  const { data: userMatches, isLoading } = useGetUserMatches();
  const { mutateAsync: computeMatches, isPending } = useComputeUserMatches();

  const handleCompute = async () => {
    await computeMatches({});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Matches</h1>
          <p className="text-sm text-muted-foreground">
            Capability-based fit scoring across roles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/user/${userId}/dashboard`}>Back</Link>
          </Button>
          <Button onClick={handleCompute} disabled={isPending}>
            {isPending ? 'Computing...' : 'Compute matches'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">Your results</CardTitle>
            <Target className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {isLoading ? (
              <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                Loading matches...
              </div>
            ) : userMatches && userMatches.length > 0 ? (
              userMatches.map((match) => (
                <div
                  key={match.id}
                  className="rounded-lg border p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-medium">{match.role?.title ?? 'Role unavailable'}</div>
                      <Badge variant="outline">{match.gapCount} gaps</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 w-full sm:w-72 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${Math.max(0, Math.min(match.score, 100))}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Fit score: {Math.round(match.score)}%
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/user/${userId}/matches/${match.id}`}>
                      Open
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))
            ) : (
              <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                No matches available yet.
              </div>
            )}
          </div>
          <Separator />
          <div className="text-sm text-muted-foreground">
            Each match explains your strengths and highlights high-impact skill gaps.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
