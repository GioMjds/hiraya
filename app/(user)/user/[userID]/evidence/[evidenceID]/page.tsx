import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default async function Page({ params }: PageProps<'/user/[userID]/evidence/[evidenceID]'>) {
  const { userID, evidenceID } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Evidence detail</h1>
          <p className="text-sm text-muted-foreground">
            Mock view showing evidence metadata and linked skills.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/user/${userID}/evidence`}>Back to evidence</Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Artifact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-sm text-muted-foreground">Title</div>
                  <div className="text-lg font-semibold">Submission</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">PROJECT</Badge>
                  <Badge variant="secondary" className="text-xs">PENDING</Badge>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="text-sm text-muted-foreground">
                Use this area for description, issuer info, dates, and links.
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-3">
              <div className="text-sm font-medium">Linked skills</div>
              <div className="grid gap-2">
                {['TypeScript', 'Next.js', 'Documentation'].map((name) => (
                  <div key={name} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                    <div className="font-medium">{name}</div>
                    <Badge variant="outline" className="text-xs">Linked</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Evidence ID</div>
              <div className="font-mono text-sm">{evidenceID}</div>
            </div>
            <Separator />
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium">Verification</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Your submission may be reviewed by an admin.
              </div>
              <Button size="sm" variant="outline" className="mt-3 w-full">
                Request verification
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
