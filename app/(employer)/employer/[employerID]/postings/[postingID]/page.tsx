import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default async function Page({
  params,
}: PageProps<'/employer/[employerID]/postings/[postingID]'>) {
  const { employerID, postingID } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Posting detail</h1>
          <p className="text-sm text-muted-foreground">
            View posting status and candidate pipeline.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/employer/${employerID}/postings`}>Back to postings</Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Posting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-sm text-muted-foreground">Title</div>
                  <div className="text-lg font-semibold">Posting data unavailable</div>
                </div>
                <Badge variant="outline">N/A</Badge>
              </div>
              <Separator className="my-4" />
              <div className="text-sm text-muted-foreground">
                This area can show location, salary range, and full posting description.
              </div>
            </div>
            <div className="rounded-lg border p-4 text-sm text-muted-foreground">
              Candidate pipeline is not available yet.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full">Edit</Button>
            <Button variant="outline" className="w-full">Close posting</Button>
            <Separator />
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Posting ID</div>
              <div className="font-mono text-sm">{postingID}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
