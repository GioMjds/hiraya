'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search, ShieldCheck } from 'lucide-react';
import { useGetAdminAuditLogs } from '@/features/authorized/admin/hooks';

export function AdminAuditClient() {
  const [search, setSearch] = useState<string>('');
  const { data: auditLogs, isLoading } = useGetAdminAuditLogs({ page: 1, limit: 20 });

  const filteredEvents = useMemo(() => {
    const source = auditLogs?.data ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return source;

    return source.filter((event) => {
      return (
        event.action.toLowerCase().includes(term) ||
        event.entityType.toLowerCase().includes(term) ||
        event.entityId.toLowerCase().includes(term)
      );
    });
  }, [auditLogs?.data, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Audit</h1>
          <p className="text-sm text-muted-foreground">
            Read-only timeline of important platform events.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin">Back to dashboard</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">Event log</CardTitle>
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search events..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <Separator />

          <div className="grid gap-3">
            {isLoading ? (
              <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                Loading audit events...
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                No audit events available.
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-medium">{event.action}</div>
                      <Badge variant="outline" className="text-xs capitalize">
                        {event.entityType}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">Entity: {event.entityId}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
