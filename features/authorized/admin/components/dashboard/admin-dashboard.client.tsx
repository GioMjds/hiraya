'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ArrowRight,
  FileText,
  FolderCheck,
  Network,
  ShieldCheck,
} from 'lucide-react';
import {
  useGetAdminDashboard,
  useGetAdminEvidenceQueue,
} from '@/features/authorized/admin/hooks';

const actions = [
  { title: 'Review evidence queue', href: '/admin/evidence' },
  { title: 'Open review requests', href: '/admin/reviews' },
  { title: 'Audit graph operations', href: '/admin/audit' },
  { title: 'Maintain capabilities', href: '/admin/capabilities' },
];

export function AdminDashboardClient() {
  const { data: dashboard, isLoading: isLoadingDashboard } =
    useGetAdminDashboard();
  const { data: reviews, isLoading: isLoadingQueue } =
    useGetAdminEvidenceQueue();

  const pendingReviews = reviews?.length ?? 0;
  const overview = [
    {
      title: 'Pending Reviews',
      value: pendingReviews,
      hint: 'Evidence items awaiting decision',
      icon: FileText,
      href: '/admin/reviews',
    },
    {
      title: 'Evidence Queue',
      value: pendingReviews,
      hint: 'New evidence submissions',
      icon: FolderCheck,
      href: '/admin/evidence',
    },
    {
      title: 'Graph Coverage',
      value: dashboard?.capabilitiesCount ?? 0,
      hint: 'Capabilities currently tracked',
      icon: Network,
      href: '/admin/capabilities',
    },
    {
      title: 'Audit Events',
      value: dashboard?.recentAuditLogs.length ?? 0,
      hint: 'Recent system actions',
      icon: ShieldCheck,
      href: '/admin/audit',
    },
  ];

  const loading = isLoadingDashboard || isLoadingQueue;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Review evidence, manage the capability graph, and monitor platform
            activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/evidence">Open evidence queue</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/reviews">
              Review requests
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overview.map((item) => (
          <Card
            key={item.title}
            className="transition-shadow hover:shadow-sm border-border/80"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-semibold">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.hint}</p>
              <Button variant="ghost" size="sm" className="px-0" asChild>
                <Link href={item.href as Route}>
                  Open
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent audit activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="rounded-lg border border-border/80 p-6 text-sm text-muted-foreground">
                Loading dashboard activity...
              </div>
            ) : dashboard?.recentAuditLogs.length ? (
              dashboard.recentAuditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="rounded-lg border border-border/80 p-4"
                >
                  <div className="text-sm font-medium">{log.action}</div>
                  <div className="text-xs text-muted-foreground">
                    {log.entityType} • {log.entityId}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-border/80 p-6 text-sm text-muted-foreground">
                No recent audit logs.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Governance controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Queue status</div>
              <Badge variant="secondary">
                {loading ? 'Loading' : 'Operational'}
              </Badge>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm font-medium">Action center</div>
              <div className="grid gap-2">
                {actions.map((item) => (
                  <Button
                    key={item.title}
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    asChild
                  >
                    <Link href={item.href as Route}>{item.title}</Link>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
