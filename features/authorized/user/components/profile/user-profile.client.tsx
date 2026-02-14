'use client';

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
  useGetProfile,
  useUpdateProfile,
} from '@/features/authorized/user/hooks';
import { UserWorkspaceHero } from '../shared/user-workspace-hero';
import { Loader2 } from 'lucide-react';

interface EditProfileFormValues {
  headline: string;
  summary: string;
  location: string;
  currentRole: string;
  targetOutcome: string;
}

export function UserProfileClient() {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const { data } = useGetProfile();
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      headline: '',
      summary: '',
      location: '',
      currentRole: '',
      targetOutcome: '',
    },
  });

  useEffect(() => {
    reset({
      headline: data?.profile?.headline ?? '',
      summary: data?.profile?.summary ?? '',
      location: data?.profile?.location ?? '',
      currentRole: data?.profile?.currentRole ?? '',
      targetOutcome: data?.profile?.targetOutcome ?? '',
    });
  }, [data, reset]);

  const fullName = data ? `${data.user.firstName} ${data.user.lastName}` : 'Unknown user';

  const onSubmit = async (values: EditProfileFormValues) => {
    setSubmitError('');
    try {
      await updateProfile({
        headline: values.headline.trim() || null,
        summary: values.summary.trim() || null,
        location: values.location.trim() || null,
        currentRole: values.currentRole.trim() || null,
        targetOutcome: values.targetOutcome.trim() || null,
      });
      setIsEditOpen(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to update profile.',
      );
    }
  };

  return (
    <div className="space-y-6">
      <UserWorkspaceHero
        title="Profile"
        description="View your profile baseline and onboarding preferences."
        actions={<Button onClick={() => setIsEditOpen(true)}>Edit profile</Button>}
        badges={[
          { label: 'Persona', value: data?.profile?.persona ?? 'Unset' },
          { label: 'Goal', value: data?.profile?.goal ?? 'Unset', variant: 'outline' },
          {
            label: 'Evidence types',
            value: data?.profile?.evidenceTypes.length ?? 0,
            variant: 'outline',
          },
        ]}
      />

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

      <AlertDialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit profile</AlertDialogTitle>
            <AlertDialogDescription>
              Update your profile summary and job-seeking context.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {submitError && (
              <Alert variant="destructive">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" {...register('headline')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea id="summary" rows={4} {...register('summary')} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register('location')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentRole">Current role</Label>
                <Input id="currentRole" {...register('currentRole')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetOutcome">Target outcome</Label>
              <Input
                id="targetOutcome"
                {...register('targetOutcome', {
                  maxLength: {
                    value: 255,
                    message: 'Target outcome must be 255 characters or less.',
                  },
                })}
              />
              {errors.targetOutcome && (
                <p className="text-sm text-destructive">{errors.targetOutcome.message}</p>
              )}
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
