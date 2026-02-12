import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Target } from 'lucide-react';

const SAMPLE_MATCHES = [
  { id: 'mock-match-1', role: 'Full-Stack Developer', score: 0.82, status: 'NEW' },
  { id: 'mock-match-2', role: 'Backend Developer', score: 0.71, status: 'NEW' },
  { id: 'mock-match-3', role: 'Frontend Developer', score: 0.66, status: 'VIEWED' },
] as const;

export default async function Page({ params }: PageProps<'/user/[userID]/matches'>) {
  const { userID } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Matches</h1>
          <p className="text-sm text-muted-foreground">
            Capability-based fit scoring across roles.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/user/${userID}/dashboard`}>Back</Link>
        </Button>
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
            {SAMPLE_MATCHES.map((match) => (
              <div
                key={match.id}
                className="rounded-lg border p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-medium">{match.role}</div>
                    <Badge variant={match.status === 'NEW' ? 'secondary' : 'outline'}>
                      {match.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-full sm:w-72 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${Math.round(match.score * 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Fit score: {Math.round(match.score * 100)}%
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/user/${userID}/matches/${match.id}`}>
                    Open
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
          <Separator />
          <div className="text-sm text-muted-foreground">
            Each match explains your strengths and highlights the highest-impact skill gaps.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
