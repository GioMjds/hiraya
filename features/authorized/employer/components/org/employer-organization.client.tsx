'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  useGetEmployerOrganization,
  useUpdateEmployerOrganization,
} from '@/features/authorized/employer/hooks';
import { Building2, ExternalLink, Loader2, Users } from 'lucide-react';
import { EmployerWorkspaceHero } from '../shared/employer-workspace-hero';

interface EmployerOrganizationClientProps {
  employerId: string;
}

interface EditOrganizationFormValues {
  name: string;
  slug: string;
  website: string;
  description: string;
}

export function EmployerOrganizationClient({
  employerId,
}: EmployerOrganizationClientProps) {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const { data: orgData } = useGetEmployerOrganization();
  const { mutateAsync: updateOrganization, isPending: isUpdating } =
    useUpdateEmployerOrganization();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<EditOrganizationFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      slug: '',
      website: '',
      description: '',
    },
  });

  useEffect(() => {
    reset({
      name: orgData?.organization.name ?? '',
      slug: orgData?.organization.slug ?? '',
      website: orgData?.organization.website ?? '',
      description: orgData?.organization.description ?? '',
    });
  }, [orgData, reset]);

  const onSubmit = async (values: EditOrganizationFormValues) => {
    if (!orgData?.organization.id) return;
    setFormError('');

    try {
      await updateOrganization({
        organizationId: orgData.organization.id,
        data: {
          name: values.name.trim() || undefined,
          slug: values.slug.trim() || undefined,
          website: values.website.trim() || undefined,
          description: values.description.trim() || undefined,
        },
      });
      setIsEditOpen(false);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Failed to update organization profile.',
      );
    }
  };

  return (
    <div className="space-y-6">
      <EmployerWorkspaceHero
        title="Organization"
        description="Keep your company profile clear and member governance aligned with hiring workflow needs."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href={`/employer/${employerId}/dashboard`}>Back to dashboard</Link>
            </Button>
            <Button asChild>
              <Link href={`/employer/${employerId}/org/members`}>
                <Users className="mr-1 h-4 w-4" />
                Members
              </Link>
            </Button>
            <Button onClick={() => setIsEditOpen(true)}>Edit organization</Button>
          </>
        }
        badges={[
          { label: 'Status', value: 'Active' },
          {
            label: 'Org role',
            value: orgData?.membership.organizationRole?.toUpperCase() ?? 'N/A',
            variant: 'outline',
          },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/80 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Org profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Organization name</div>
                <div className="font-medium">{orgData?.organization.name ?? 'Not set'}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Slug</div>
                <div className="font-medium">{orgData?.organization.slug ?? 'Not set'}</div>
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Website</div>
              <div className="font-medium">{orgData?.organization.website ?? 'Not set'}</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Description</div>
              <div className="text-sm">{orgData?.organization.description ?? 'Not set'}</div>
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

      <AlertDialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit organization profile</AlertDialogTitle>
            <AlertDialogDescription>
              Update organization information shown across employer workflows.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization name</Label>
              <Input id="org-name" {...register('name')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-slug">Slug</Label>
              <Input id="org-slug" {...register('slug')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-website">Website</Label>
              <Input id="org-website" {...register('website')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-description">Description</Label>
              <Textarea id="org-description" rows={4} {...register('description')} />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button type="button" variant="outline" disabled={isUpdating}>
                  Cancel
                </Button>
              </AlertDialogCancel>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save changes'
                )}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
