'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetUserEvidenceDetail } from '@/features/authorized/user/hooks';

interface UserEvidenceDetailClientProps {
  userId: string;
  evidenceId: string;
}

export function UserEvidenceDetailClient({
  userId,
  evidenceId,
}: UserEvidenceDetailClientProps) {
  const { data } = useGetUserEvidenceDetail(evidenceId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Evidence detail</h1>
          <p className="text-sm text-muted-foreground">
            View evidence metadata and linked skills.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/user/${userId}/evidence`}>Back to evidence</Link>
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
                  <div className="text-lg font-semibold">{data?.title ?? 'Unavailable'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs uppercase">
                    {data?.type ?? 'N/A'}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {data?.deletedAt ? 'Deleted' : 'Active'}
                  </Badge>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="text-sm text-muted-foreground">
                {data?.description ?? 'No description provided.'}
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-3">
              <div className="text-sm font-medium">Linked skills</div>
              {data?.skillLinks && data.skillLinks.length > 0 ? (
                data.skillLinks.map((item) => (
                  <div key={item.id} className="rounded-lg border p-3 text-sm">
                    <div className="font-medium">{item.skillId}</div>
                    <div className="text-muted-foreground uppercase">{item.level}</div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                  No linked skills available yet.
                </div>
              )}
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
              <div className="font-mono text-sm">{evidenceId}</div>
            </div>
            <Separator />
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium">Links</div>
              <div className="mt-2 space-y-2">
                {data?.links && data.links.length > 0 ? (
                  data.links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-sm text-primary underline-offset-2 hover:underline"
                    >
                      {link.label ?? link.url}
                    </a>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">No links attached.</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
