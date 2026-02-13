'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Search } from 'lucide-react';
import { useGetUserEvidence } from '@/features/authorized/user/hooks';

interface UserEvidenceClientProps {
  userId: string;
}

export function UserEvidenceClient({ userId }: UserEvidenceClientProps) {
  const { data: userEvidence, isLoading } = useGetUserEvidence();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Evidence</h1>
          <p className="text-sm text-muted-foreground">
            Artifacts linked to your skill claims.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/user/${userId}/dashboard`}>Back</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Your submissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search evidence..." disabled />
          </div>

          <Separator />

          <div className="grid gap-3">
            {isLoading ? (
              <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                Loading evidence...
              </div>
            ) : userEvidence && userEvidence.length > 0 ? (
              userEvidence.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-medium">{item.title}</div>
                      <Badge variant="outline" className="text-xs uppercase">
                        {item.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">Evidence ID: {item.id}</div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/user/${userId}/evidence/${item.id}`}>
                      Open
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))
            ) : (
              <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                No evidence available yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
