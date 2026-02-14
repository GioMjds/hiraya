'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Search, ShieldCheck } from 'lucide-react';
import { useGetAdminEvidenceQueue } from '@/features/authorized/admin/hooks';
import { AdminWorkspaceHero } from '../shared/admin-workspace-hero';

function getStatusVariant(status: string): 'secondary' | 'outline' {
  if (status === 'PENDING') return 'secondary';
  return 'outline';
}

export function AdminReviewsClient() {
  const [search, setSearch] = useState<string>('');
  const { data: reviews, isLoading } = useGetAdminEvidenceQueue();

  const filteredReviews = useMemo(() => {
    const source = reviews ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return source;

    return source.filter((item) => {
      return (
        item.id.toLowerCase().includes(term) ||
        item.entityId.toLowerCase().includes(term) ||
        item.action.toLowerCase().includes(term)
      );
    });
  }, [reviews, search]);
  const pendingCount =
    (reviews ?? []).filter((item) => item.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <AdminWorkspaceHero
        title="Reviews"
        description="Triaging evidence review requests quickly keeps governance decisions consistent."
        actions={
          <Button size="sm" asChild>
            <Link href="/admin">Back to dashboard</Link>
          </Button>
        }
        badges={[
          { label: 'Queue size', value: reviews?.length ?? 0 },
          { label: 'Pending', value: pendingCount, variant: 'outline' },
        ]}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Search reviews..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">Pending</Badge>
                  <Badge variant="outline">Approved</Badge>
                  <Badge variant="outline">Rejected</Badge>
                </div>
              </div>

              <Separator />

              <div className="grid gap-3">
                {isLoading ? (
                  <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                    Loading review queue...
                  </div>
                ) : filteredReviews.length === 0 ? (
                  <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                    No review items in queue.
                  </div>
                ) : (
                  filteredReviews.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="font-medium">{item.entityType}</div>
                          <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">Action: {item.action}</div>
                        <div className="text-xs text-muted-foreground">Review ID: {item.id}</div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/reviews/${item.id}`}>
                          Open
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg border p-4 space-y-2">
                <div className="text-sm font-medium flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Governance note
                </div>
                <div className="text-sm text-muted-foreground">
                  Prioritize pending items with high platform impact and limited verification evidence.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
