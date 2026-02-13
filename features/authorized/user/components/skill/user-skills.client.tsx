'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { useGetUserSkills } from '@/features/authorized/user/hooks';

interface UserSkillsClientProps {
  userId: string;
}

export function UserSkillsClient({ userId }: UserSkillsClientProps) {
  const { data: userSkills, isLoading } = useGetUserSkills();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Skills</h1>
          <p className="text-sm text-muted-foreground">
            Declared skills and confidence levels.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">Your skill map</CardTitle>
            <Sparkles className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search your skills..." disabled />
          </div>

          <Separator />

          <div className="grid gap-3">
            {isLoading ? (
              <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                Loading skills...
              </div>
            ) : userSkills && userSkills.length > 0 ? (
              userSkills.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="font-medium">{item.skill?.name ?? item.skillId}</div>
                    <div className="text-xs text-muted-foreground">
                      Confidence: {item.confidence}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs uppercase">
                      {item.level}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/user/${userId}/skills/${item.id}`}>
                        Open
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                No skills available yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
