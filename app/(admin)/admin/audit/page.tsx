import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search, ShieldCheck } from 'lucide-react';

const SAMPLE_EVENTS = [
  { action: 'EVIDENCE_SUBMITTED', actor: 'user', time: '—', outcome: 'OK' },
  { action: 'REVIEW_APPROVED', actor: 'admin', time: '—', outcome: 'OK' },
  { action: 'SKILL_UPDATED', actor: 'admin', time: '—', outcome: 'OK' },
  { action: 'LOGIN', actor: 'user', time: '—', outcome: 'OK' },
] as const;

export default function Page() {
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
            <Input className="pl-9" placeholder="Search events..." />
          </div>

          <Separator />

          <div className="grid gap-3">
            {SAMPLE_EVENTS.map((event, index) => (
              <div
                key={`${event.action}-${index}`}
                className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-medium">{event.action}</div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {event.actor}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {event.outcome}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">Timestamp: {event.time}</div>
                </div>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
