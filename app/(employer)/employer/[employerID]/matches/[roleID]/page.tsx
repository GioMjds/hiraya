import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Page({ params }: PageProps<'/employer/[employerID]/matches/[roleID]'>) {
  const { employerID, roleID } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Role matches</h1>
          <p className="text-sm text-muted-foreground">
            Candidate fit scores for a specific role (mock).
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/employer/${employerID}/matches`}>Back to matches</Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Candidates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Candidate A', score: 0.84, status: 'NEW' },
              { name: 'Candidate B', score: 0.73, status: 'NEW' },
              { name: 'Candidate C', score: 0.61, status: 'VIEWED' },
            ].map((row) => (
              <div key={row.name} className="rounded-lg border p-4 space-y-2">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="font-medium">{row.name}</div>
                    <div className="text-xs text-muted-foreground">Fit score: {Math.round(row.score * 100)}%</div>
                  </div>
                  <Badge variant={row.status === 'NEW' ? 'secondary' : 'outline'}>{row.status}</Badge>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${Math.round(row.score * 100)}%` }} />
                </div>
                <div className="flex items-center justify-end">
                  <Button variant="outline" size="sm">Open profile</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Role context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium">Role ID</div>
              <div className="mt-1 font-mono text-sm">{roleID}</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium">Shortlist criteria</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Mock area for minimum score, critical requirements, and evidence requirements.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
