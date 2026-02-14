'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, FolderCheck, Search } from 'lucide-react';
import { useGetAdminEvidenceQueue } from '@/features/authorized/admin/hooks';

export function AdminEvidenceClient() {
  const [search, setSearch] = useState<string>('');
  const { data: evidenceQueue, isLoading } = useGetAdminEvidenceQueue();

  const filteredQueue = useMemo(() => {
    const source = evidenceQueue ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return source;

    return source.filter((item) => {
      return (
        item.id.toLowerCase().includes(term) ||
        item.entityId.toLowerCase().includes(term) ||
        item.entityType.toLowerCase().includes(term)
      );
    });
  }, [evidenceQueue, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Evidence</h1>
          <p className="text-sm text-muted-foreground">
            Browse submitted evidence and verify it against skill claims.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin">Back to dashboard</Link>
        </Button>
      </div>

      <Card className="border-border/80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="space-y-1">
              <CardTitle className="text-base">Queue</CardTitle>
              <div className="text-sm text-muted-foreground">
                New submissions appear here for review.
              </div>
            </div>
            <FolderCheck className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search evidence..."
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
              <div className="rounded-lg border border-border/80 p-6 text-sm text-muted-foreground">
                Loading evidence queue...
              </div>
            ) : filteredQueue.length === 0 ? (
              <div className="rounded-lg border border-border/80 p-6 text-sm text-muted-foreground">
                No evidence submissions found.
              </div>
            ) : (
              filteredQueue.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-lg border border-border/80 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-medium">{item.entityType}</div>
                      <Badge variant="outline" className="text-xs">
                        {item.action}
                      </Badge>
                      <Badge variant={item.status === 'PENDING' ? 'secondary' : 'outline'}>
                        {item.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">Review ID: {item.id}</div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/evidence/${item.id}`}>
                      Open
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
