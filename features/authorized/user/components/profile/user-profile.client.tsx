'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetProfile } from '@/features/authorized/user/hooks';

export function UserProfileClient() {
  const { data } = useGetProfile();

  const fullName = data ? `${data.user.firstName} ${data.user.lastName}` : 'Unknown user';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">
            View your profile and onboarding preferences.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Basic information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Name</div>
              <div className="text-lg font-semibold">{fullName}</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{data?.user?.email ?? 'N/A'}</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Headline</div>
              <div className="font-medium">{data?.profile?.headline ?? 'Not set'}</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Summary</div>
              <div className="text-sm">{data?.profile?.summary ?? 'No summary yet'}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Onboarding tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{data?.profile?.persona ?? 'Persona'}</Badge>
              <Badge variant="outline">{data?.profile?.goal ?? 'Goal'}</Badge>
              <Badge variant="outline">
                Evidence: {data?.profile?.evidenceTypes.length ?? 0}
              </Badge>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Target outcome</div>
              <div className="text-sm">{data?.profile?.targetOutcome ?? 'Not set'}</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium">Organization</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {data?.profile?.organizationName ?? 'No organization setup'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
