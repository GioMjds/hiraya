import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';

export default async function Page({ params }: PageProps<'/user/[userID]/matches/[matchID]'>) {
  const { userID, matchID } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Match detail</h1>
          <p className="text-sm text-muted-foreground">
            Explanation summary and prioritized gaps (mock).
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/user/${userID}/matches`}>
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
                  <div className="text-lg font-semibold">Full-Stack Developer</div>
                </div>
                <Badge variant="secondary">82%</Badge>
              </div>
              <Separator className="my-4" />
              <div className="text-sm text-muted-foreground">
                This section can summarize why the match is strong and what capabilities contributed most.
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-3">
              <div className="text-sm font-medium">Top strengths</div>
              <div className="grid gap-2">
                {['Frontend capability', 'API integration', 'Evidence quality'].map((text) => (
                  <div key={text} className="flex items-start gap-2 rounded-lg border p-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <div className="text-sm text-muted-foreground">{text}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skill gaps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { name: 'Database Design', impact: 'High' },
              { name: 'System Architecture', impact: 'Medium' },
              { name: 'DevOps', impact: 'Medium' },
            ].map((gap) => (
              <div key={gap.name} className="rounded-lg border p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{gap.name}</div>
                  <div className="text-xs text-muted-foreground">Impact: {gap.impact}</div>
                </div>
                <Badge variant="outline">Gap</Badge>
              </div>
            ))}
            <Separator />
            <div className="text-xs text-muted-foreground">Match ID: {matchID}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
