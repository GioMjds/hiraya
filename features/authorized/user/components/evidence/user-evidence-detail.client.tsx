'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import {
  useGetUserEvidenceDetail,
  useGetUserSkills,
} from '@/features/authorized/user/hooks';

interface UserEvidenceDetailClientProps {
  userId: string;
  evidenceId: string;
}

const toTitle = (value: string) =>
  value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export function UserEvidenceDetailClient({
  userId,
  evidenceId,
}: UserEvidenceDetailClientProps) {
  const { data, isLoading } = useGetUserEvidenceDetail(evidenceId);
  const { data: userSkills } = useGetUserSkills();
  const userSkillNameBySkillId = new Map(
    (userSkills ?? []).map((item) => [item.skillId, item.skill?.name ?? null]),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Evidence detail
          </h1>
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
            {isLoading ? (
              <div className="rounded-lg border p-4 text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading evidence details...
              </div>
            ) : data ? (
              <>
                <div className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="text-sm text-muted-foreground">Title</div>
                      <div className="text-lg font-semibold">
                        {data?.title ?? 'Unavailable'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs uppercase">
                        {data?.type ? toTitle(data.type) : 'N/A'}
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

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <div className="text-xs text-muted-foreground">
                      Issued by
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      {data?.issuedBy ?? 'N/A'}
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-xs text-muted-foreground">
                      Issued at
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      {data?.issuedAt
                        ? new Date(data.issuedAt).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-xs text-muted-foreground">
                      Expires at
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      {data?.expiresAt
                        ? new Date(data.expiresAt).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <div className="text-sm font-medium">Linked skills</div>
                  {data?.skillLinks && data.skillLinks.length > 0 ? (
                    data.skillLinks.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border p-3 text-sm"
                      >
                        <div className="font-medium">
                          {userSkillNameBySkillId.get(item.skillId) ??
                            item.skillId}
                        </div>
                        <div className="text-muted-foreground uppercase">
                          {toTitle(item.level)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                      No linked skills available yet.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                Evidence data is unavailable.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evidence context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border p-3 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Status</div>
              <Badge variant={data?.deletedAt ? 'outline' : 'secondary'}>
                {data?.deletedAt ? 'Inactive' : 'Active'}
              </Badge>
            </div>
            <div className="rounded-lg border p-3 text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Linked skills: {data?.skillLinks?.length ?? 0}
            </div>
            <div className="rounded-lg border p-3 text-sm text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Better evidence links improve match explainability.
            </div>
            <Separator />
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href={`/user/${userId}/skills`}>
                Review skills
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
