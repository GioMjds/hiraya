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
            Candidate fit scores for a specific role.
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
            <div className="rounded-lg border p-4 text-sm text-muted-foreground">
              No candidate match data available yet.
            </div>
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
                Area for minimum score, critical requirements, and evidence requirements.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
