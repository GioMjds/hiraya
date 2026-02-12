import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Page({
  params,
}: PageProps<'/admin/evidence/[evidenceID]'>) {
  const { evidenceID } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Evidence Detail</h1>
          <p className="text-sm text-muted-foreground">
            Inspect the artifact and verify its linked skills.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/evidence">Back to evidence</Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="space-y-1">
                  <CardTitle className="text-base">Artifact</CardTitle>
                  <div className="text-sm text-muted-foreground">Submission</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">PENDING</Badge>
                  <Badge variant="outline">PROJECT</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border p-4">
                <div className="text-sm font-medium">Description</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Mock layout for evidence content, links, and verification details.
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm font-medium">Links</div>
                <div className="mt-2 grid gap-2">
                  {[
                    { label: 'Repository', value: '—' },
                    { label: 'Live demo', value: '—' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-3">
                      <div className="text-sm text-muted-foreground">{row.label}</div>
                      <div className="text-sm font-medium">{row.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Linked skill claims</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {['TypeScript', 'Next.js', 'API Design'].map((name) => (
                <div key={name} className="rounded-lg border p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{name}</div>
                    <div className="text-xs text-muted-foreground">Confidence: —</div>
                  </div>
                  <Badge variant="outline" className="text-xs">REVIEW</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Actions are mocked here for visualization.
              </div>
              <div className="grid gap-2">
                <Button>Mark verified</Button>
                <Button variant="outline">Request changes</Button>
                <Button variant="destructive">Reject</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-sm text-muted-foreground">Evidence ID</div>
              <div className="font-mono text-sm">{evidenceID}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
