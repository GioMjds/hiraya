'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useGetEmployerOrganization } from '@/features/authorized/employer/hooks';
import { Building2, ExternalLink, Users } from 'lucide-react';

interface EmployerOrganizationClientProps {
  employerId: string;
}

export function EmployerOrganizationClient({
  employerId,
}: EmployerOrganizationClientProps) {
  const { data: orgData } = useGetEmployerOrganization();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Organization</h1>
          <p className="text-sm text-muted-foreground">
            Manage your org profile and member access.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/employer/${employerId}/dashboard`}>Back to dashboard</Link>
          </Button>
          <Button asChild>
            <Link href={`/employer/${employerId}/org/members`}>
              <Users className="mr-1 h-4 w-4" />
              Members
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/80 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Org profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization name</Label>
                <Input
                  id="orgName"
                  defaultValue={orgData?.organization.name ?? ''}
                  placeholder="e.g., Your Company"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgSlug">Slug</Label>
                <Input
                  id="orgSlug"
                  defaultValue={orgData?.organization.slug ?? ''}
                  placeholder="e.g., your-company"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                defaultValue={orgData?.organization.website ?? ''}
                placeholder="https://"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                defaultValue={orgData?.organization.description ?? ''}
                placeholder="Organization description"
              />
            </div>
            <Separator />
            <div className="rounded-lg border border-border/80 p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="font-medium">Public profile preview</div>
                  <div className="text-sm text-muted-foreground">
                    Space for how the organization appears to candidates.
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-1 h-4 w-4" />
                  Preview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="text-base">Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Status</div>
              <Badge variant="secondary">Active</Badge>
            </div>
            <Separator />
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Employer ID</div>
              <div className="font-mono text-sm">{employerId}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Membership role</div>
              <div className="font-mono text-sm uppercase">
                {orgData?.membership.organizationRole ?? 'N/A'}
              </div>
            </div>
            <div className="rounded-lg border border-border/80 p-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm font-medium">Governance</div>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Manage who can create roles and publish postings.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
