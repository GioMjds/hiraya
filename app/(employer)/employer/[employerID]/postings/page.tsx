import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, FileText, Plus, Search } from 'lucide-react';

const SAMPLE_POSTINGS = [
  { id: 'mock-posting-1', title: 'Senior Full-Stack Engineer', status: 'OPEN' },
  { id: 'mock-posting-2', title: 'Frontend Engineer', status: 'DRAFT' },
  { id: 'mock-posting-3', title: 'Backend Engineer', status: 'CLOSED' },
] as const;

export default async function Page({ params }: PageProps<'/employer/[employerID]/postings'>) {
  const { employerID } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Postings</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage job postings tied to roles (mock).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/employer/${employerID}/dashboard`}>Back</Link>
          </Button>
          <Button asChild>
            <Link href={`/employer/${employerID}/postings/new`}>
              <Plus className="mr-1 h-4 w-4" />
              New posting
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">All postings</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search postings..." />
          </div>
          <Separator />
          <div className="grid gap-3">
            {SAMPLE_POSTINGS.map((posting) => (
              <div
                key={posting.id}
                className="rounded-lg border p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-medium">{posting.title}</div>
                  <div className="text-xs text-muted-foreground">Posting ID: {posting.id}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={posting.status === 'OPEN' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {posting.status}
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/employer/${employerID}/postings/${posting.id}`}>
                      Open
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
