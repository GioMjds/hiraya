'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Search, ShieldCheck } from 'lucide-react';
import { useGetAdminAuditLogs } from '@/features/authorized/admin/hooks';
import { AdminWorkspaceHero } from '../shared/admin-workspace-hero';

export function AdminAuditClient() {
  const [search, setSearch] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [entityFilter, setEntityFilter] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [sinceFilter, setSinceFilter] = useState<string>('');
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
    }).filter((event) => {
      if (
        entityFilter &&
        !event.entityType.toLowerCase().includes(entityFilter.toLowerCase())
      ) {
        return false;
      }
      if (
        actionFilter &&
        !event.action.toLowerCase().includes(actionFilter.toLowerCase())
      ) {
        return false;
      }
      if (sinceFilter && new Date(event.createdAt) < new Date(sinceFilter)) {
        return false;
      }
      return true;
    });
  }, [actionFilter, auditLogs?.data, entityFilter, search, sinceFilter]);
  const totalEvents = auditLogs?.data.length ?? 0;

  return (
    <div className="space-y-6">
      <AdminWorkspaceHero
        title="Audit"
        description="Track platform events and review governance activity with searchable context."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/admin">Back to dashboard</Link>
            </Button>
            <Button onClick={() => setIsFilterOpen(true)}>Filters</Button>
          </>
        }
        badges={[
          { label: 'Loaded events', value: totalEvents },
          { label: 'Filtered', value: filteredEvents.length, variant: 'outline' },
        ]}
      />

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

      <AlertDialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Filter audit events</AlertDialogTitle>
            <AlertDialogDescription>
              Filter loaded audit events by entity, action, and date.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="entity-filter">Entity type</Label>
              <Input
                id="entity-filter"
                placeholder="evidence_review"
                value={entityFilter}
                onChange={(event) => setEntityFilter(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="action-filter">Action</Label>
              <Input
                id="action-filter"
                placeholder="approve"
                value={actionFilter}
                onChange={(event) => setActionFilter(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="since-filter">Since</Label>
              <Input
                id="since-filter"
                type="date"
                value={sinceFilter}
                onChange={(event) => setSinceFilter(event.target.value)}
              />
            </div>
            <AlertDialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEntityFilter('');
                  setActionFilter('');
                  setSinceFilter('');
                }}
              >
                Reset filters
              </Button>
              <AlertDialogCancel asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </AlertDialogCancel>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
