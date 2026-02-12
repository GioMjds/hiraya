import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, CheckCircle2, FileText, FolderCheck, Network, ShieldCheck } from 'lucide-react';

const OVERVIEW = [
  {
    title: 'Pending Reviews',
    value: '—',
    hint: 'Evidence items awaiting decision',
    icon: FileText,
    href: '/admin/reviews',
  },
  {
    title: 'Evidence Queue',
    value: '—',
    hint: 'New evidence submissions',
    icon: FolderCheck,
    href: '/admin/evidence',
  },
  {
    title: 'Graph Coverage',
    value: '—',
    hint: 'Skills ↔ capabilities mapped',
    icon: Network,
    href: '/admin/capabilities',
  },
  {
    title: 'Audit Events',
    value: '—',
    hint: 'Recent system actions',
    icon: ShieldCheck,
    href: '/admin/audit',
  },
] as const;

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Review evidence, manage the capability graph, and monitor platform activity.
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
        {OVERVIEW.map((item) => (
          <Card key={item.title} className="hover:shadow-sm transition-shadow">
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
                <Link href={item.href}>
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
            <CardTitle className="text-base">Work Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col gap-3">
              {[
                {
                  title: 'Evidence verification requested',
                  meta: 'New submission • Pending',
                  href: '/admin/evidence/mock-evidence-1',
                },
                {
                  title: 'Review decision needed',
                  meta: 'Admin review • Pending',
                  href: '/admin/reviews/mock-review-1',
                },
                {
                  title: 'Graph edge requires validation',
                  meta: 'Skill ↔ capability mapping',
                  href: '/admin/capabilities',
                },
              ].map((row) => (
                <div
                  key={row.title}
                  className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="font-medium">{row.title}</div>
                    <div className="text-sm text-muted-foreground">{row.meta}</div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={row.href}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Indexing</div>
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                OK
              </Badge>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm font-medium">Quick links</div>
              <div className="grid gap-2">
                <Button variant="ghost" size="sm" className="justify-start" asChild>
                  <Link href="/admin/skills">Manage skills</Link>
                </Button>
                <Button variant="ghost" size="sm" className="justify-start" asChild>
                  <Link href="/admin/capabilities">Manage capabilities</Link>
                </Button>
                <Button variant="ghost" size="sm" className="justify-start" asChild>
                  <Link href="/admin/audit">View audit log</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
