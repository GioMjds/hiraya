import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Briefcase, Plus, Search } from 'lucide-react';

const roles: Array<{ id: string; title: string; status: string }> = [];

export default async function Page({ params }: PageProps<'/employer/[employerID]/roles'>) {
  const { employerID } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Roles</h1>
          <p className="text-sm text-muted-foreground">
            Define roles in terms of skills and capabilities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/employer/${employerID}/dashboard`}>Back to dashboard</Link>
          </Button>
          <Button>
            <Plus className="mr-1 h-4 w-4" />
            New role
          </Button>
        </div>
      </div>

      <Card className="border-border/80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">Role library</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search roles..." />
          </div>
          <Separator />
          <div className="grid gap-3">
            {roles.length === 0 ? (
              <div className="rounded-lg border border-border/80 p-6 text-sm text-muted-foreground">
                No roles yet.
              </div>
            ) : (
              roles.map((role) => (
                <div
                  key={role.id}
                  className="rounded-lg border border-border/80 p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="font-medium">{role.title}</div>
                    <div className="text-xs text-muted-foreground">Role ID: {role.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={role.status === 'PUBLISHED' ? 'secondary' : 'outline'}
                      className="uppercase"
                    >
                      {role.status}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/employer/${employerID}/roles/${role.id}`}>
                        Open
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
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
