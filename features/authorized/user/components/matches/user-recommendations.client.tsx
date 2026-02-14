'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { useGetUserRecommendations } from '@/features/authorized/user/hooks';
import { UserWorkspaceHero } from '../shared/user-workspace-hero';

interface UserRecommendationsClientProps {
  userId: string;
}

export function UserRecommendationsClient({
  userId,
}: UserRecommendationsClientProps) {
  const { data, isLoading } = useGetUserRecommendations();
  const suggestedRolesCount = data?.topRoleMatches?.length ?? 0;
  const learningRecommendationsCount = data?.learningRecommendations?.length ?? 0;

  return (
    <div className="space-y-6">
      <UserWorkspaceHero
        title="Recommendations"
        description="Explore suggested roles and learning actions generated from your capability graph."
        actions={
          <Button variant="outline" asChild>
            <Link href={`/user/${userId}/dashboard`}>Back to dashboard</Link>
          </Button>
        }
        badges={[
          { label: 'Role suggestions', value: suggestedRolesCount },
          {
            label: 'Learning actions',
            value: learningRecommendationsCount,
            variant: 'outline',
          },
        ]}
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">Suggested next roles</CardTitle>
            <Lightbulb className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {isLoading ? (
              <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                Loading recommendations...
              </div>
            ) : data?.topRoleMatches && data.topRoleMatches.length > 0 ? (
              data.topRoleMatches.map((rec) => (
                <div key={rec.match.id} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="font-medium">{rec.role?.title ?? 'Role unavailable'}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Match score: {Math.round(rec.match.score)}%
                      </div>
                    </div>
                    <Badge variant="secondary">Suggested role</Badge>
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                      Next action: Review role gaps and improve top missing capabilities.
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/user/${userId}/matches/${rec.match.id}`}>
                        Open match
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                No role recommendations yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Learning recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="rounded-lg border p-6 text-sm text-muted-foreground">
              Loading learning recommendations...
            </div>
          ) : data?.learningRecommendations && data.learningRecommendations.length > 0 ? (
            <div className="grid gap-3">
              {data.learningRecommendations.map((item, index) => (
                <div key={`${item.capabilityId ?? 'cap'}-${index}`} className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="font-medium">{item.capabilityName ?? item.capabilityId ?? 'Unknown capability'}</div>
                      <div className="text-sm text-muted-foreground">
                        Required: {item.requiredLevel} • Current: {item.currentLevel ?? 'none'}
                      </div>
                    </div>
                    <Badge variant="outline">Gap {Math.round(item.gapScore)}%</Badge>
                  </div>
                  <Separator />
                  {item.relatedUserSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {item.relatedUserSkills.map((skill) => (
                        <Badge key={skill.userSkillId} variant="secondary">
                          {skill.skillId} • {skill.level}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No directly related current user skills.</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border p-6 text-sm text-muted-foreground">
              No learning recommendations yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
