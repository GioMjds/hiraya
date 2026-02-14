import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Plus, Search, Users } from 'lucide-react';

const members: Array<{ name: string; email: string; role: string }> = [];

export default async function Page({
  params,
}: PageProps<'/employer/[employerID]/org/members'>) {
  const { employerID } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Members</h1>
          <p className="text-sm text-muted-foreground">
            Invite and manage organization members.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/employer/${employerID}/org`}>Back to organization</Link>
          </Button>
          <Button>
            <Plus className="mr-1 h-4 w-4" />
            Invite member
          </Button>
        </div>
      </div>

      <Card className="border-border/80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">Team</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search members..." />
          </div>
          <Separator />
          <div className="grid gap-3">
            {members.length === 0 ? (
              <div className="rounded-lg border border-border/80 p-6 text-sm text-muted-foreground">
                No members yet.
              </div>
            ) : (
              members.map((member) => (
                <div
                  key={`${member.email}-${member.role}`}
                  className="rounded-lg border border-border/80 p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {member.email}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {member.role}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Manage
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
