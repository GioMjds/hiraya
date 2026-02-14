import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Gauge, Target } from 'lucide-react';

export default async function Page({
  params,
}: PageProps<'/employer/[employerID]/roles/[roleID]'>) {
  const { employerID, roleID } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Role detail</h1>
          <p className="text-sm text-muted-foreground">
              View role requirements and how matches are computed.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/employer/${employerID}/roles`}>Back to roles</Link>
          </Button>
          <Button asChild>
            <Link href={`/employer/${employerID}/matches/${roleID}`}>View matches</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-sm text-muted-foreground">Role ID</div>
                  <div className="text-lg font-semibold">{roleID}</div>
                </div>
                <Badge variant="secondary">PUBLISHED</Badge>
              </div>
              <Separator className="my-4" />
              <div className="text-sm text-muted-foreground">
                Role details will appear once connected to API data.
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Card className="py-4">
                <CardContent className="space-y-2">
                  <div className="text-sm font-medium">Critical skills</div>
                  <div className="flex flex-wrap gap-1.5">
                      <div className="text-xs text-muted-foreground">No critical skills yet.</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="py-4">
                <CardContent className="space-y-2">
                  <div className="text-sm font-medium">Key capabilities</div>
                  <div className="flex flex-wrap gap-1.5">
                      <div className="text-xs text-muted-foreground">No key capabilities yet.</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Role controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border p-3 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Role state</div>
              <Badge variant="secondary">PUBLISHED</Badge>
            </div>
            <div className="rounded-lg border p-3 text-sm text-muted-foreground flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Keep requirements specific to improve quality of candidate matching.
            </div>
            <Button variant="outline" className="w-full">Edit requirements</Button>
            <Button variant="outline" className="w-full">Publish / Archive</Button>
            <Separator />
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium">Posting</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Create a posting that references this role.
              </div>
              <Button size="sm" className="mt-3 w-full" asChild>
                <Link href={`/employer/${employerID}/postings/new`}>New posting</Link>
              </Button>
            </div>
            <div className="rounded-lg border p-3 text-sm text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Role-match alignment should be reviewed before publishing updates.
            </div>
            <div className="rounded-lg border p-3 text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Use consistent capability weighting across similar roles.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
