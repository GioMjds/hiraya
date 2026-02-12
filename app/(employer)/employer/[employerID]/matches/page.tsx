import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Search, Target } from 'lucide-react';

const SAMPLE_ROLES = [
  { id: 'mock-role-1', title: 'Full-Stack Developer', candidates: '—' },
  { id: 'mock-role-2', title: 'Frontend Developer', candidates: '—' },
  { id: 'mock-role-3', title: 'Backend Developer', candidates: '—' },
] as const;

export default async function Page({
  params,
}: {
  params: Promise<{ employerID: string }>;
}) {
  const { employerID } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Matches</h1>
          <p className="text-sm text-muted-foreground">
            Pick a role to view candidate fit scores (mock).
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/employer/${employerID}/dashboard`}>Back</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">Roles</CardTitle>
            <Target className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search roles..." />
          </div>

          <Separator />

          <div className="grid gap-3">
            {SAMPLE_ROLES.map((role) => (
              <div
                key={role.id}
                className="rounded-lg border p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="font-medium">{role.title}</div>
                  <div className="text-xs text-muted-foreground">
                    Role ID: {role.id}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Candidates: {role.candidates}
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/employer/${employerID}/matches/${role.id}`}>
                      View
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
