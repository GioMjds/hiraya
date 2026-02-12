import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Filter, Search } from 'lucide-react';

const SAMPLE_REVIEWS = [
  {
    id: 'mock-review-1',
    title: 'Evidence verification',
    status: 'PENDING',
    hint: 'User requests verification for a submitted artifact.',
  },
  {
    id: 'mock-review-2',
    title: 'Skill claim dispute',
    status: 'PENDING',
    hint: 'Conflicting evidence requires manual decision.',
  },
  {
    id: 'mock-review-3',
    title: 'Graph edge submission',
    status: 'APPROVED',
    hint: 'New skill ↔ capability edge request.',
  },
] as const;

function getStatusVariant(status: string): 'secondary' | 'outline' {
  if (status === 'PENDING') return 'secondary';
  return 'outline';
}

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reviews</h1>
          <p className="text-sm text-muted-foreground">
            Admin review queue for evidence verification and graph governance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-1 h-4 w-4" />
            Filters
          </Button>
          <Button size="sm" asChild>
            <Link href="/admin">Back to dashboard</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search reviews..." />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Pending</Badge>
              <Badge variant="outline">Approved</Badge>
              <Badge variant="outline">Rejected</Badge>
            </div>
          </div>

          <Separator />

          <div className="grid gap-3">
            {SAMPLE_REVIEWS.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-medium">{item.title}</div>
                    <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{item.hint}</div>
                  <div className="text-xs text-muted-foreground">Review ID: {item.id}</div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/reviews/${item.id}`}>
                    Open
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
