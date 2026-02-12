import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, FolderCheck, Search } from 'lucide-react';

const SAMPLE_EVIDENCE = [
  {
    id: 'mock-evidence-1',
    title: 'Project artifact',
    type: 'PROJECT',
    status: 'PENDING',
  },
  {
    id: 'mock-evidence-2',
    title: 'Repository link',
    type: 'REPOSITORY',
    status: 'PENDING',
  },
  {
    id: 'mock-evidence-3',
    title: 'Certificate',
    type: 'CERTIFICATE',
    status: 'VERIFIED',
  },
] as const;

export default function Page() {
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

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="space-y-1">
              <CardTitle className="text-base">Queue</CardTitle>
              <div className="text-sm text-muted-foreground">
                New submissions appear here for review.
              </div>
            </div>
            <FolderCheck className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search evidence..." />
          </div>

          <Separator />

          <div className="grid gap-3">
            {SAMPLE_EVIDENCE.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-medium">{item.title}</div>
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                    <Badge variant={item.status === 'PENDING' ? 'secondary' : 'outline'}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">Evidence ID: {item.id}</div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/evidence/${item.id}`}>
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
