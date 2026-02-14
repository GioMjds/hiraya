'use client';

import Link from 'next/link';
import { useMemo, useOptimistic, useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ApiError } from '@/configs/fetch';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Search,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import {
  useCreateUserEvidence,
  useDeleteUserEvidence,
  useGetUserEvidence,
  useGetUserSkills,
  useUpdateUserEvidence,
} from '@/features/authorized/user/hooks';
import type {
  EvidenceType,
  EvidenceWithRelations,
} from '@/lib/api/authorized/user';
import { UserWorkspaceHero } from '../shared/user-workspace-hero';

interface UserEvidenceClientProps {
  userId: string;
}

const EVIDENCE_TYPES: EvidenceType[] = [
  'project',
  'repository',
  'certificate',
  'assessment',
  'experience',
];

interface EvidenceFormValues {
  type: EvidenceType;
  title: string;
  description: string;
  issuedBy: string;
  issuedAt: string;
  expiresAt: string;
  skillId: string;
  linkUrl: string;
  linkLabel: string;
}

interface OptimisticState {
  message: string;
  type: 'idle' | 'loading' | 'success' | 'error';
}

const toTitle = (value: string) =>
  value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const toIsoDate = (date: string): string | null =>
  date ? new Date(`${date}T00:00:00.000Z`).toISOString() : null;

const toDateInput = (value: string | null | undefined): string => {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
};

export function UserEvidenceClient({ userId }: UserEvidenceClientProps) {
  const [search, setSearch] = useState<string>('');
  const [editingEvidence, setEditingEvidence] =
    useState<EvidenceWithRelations | null>(null);
  const [deletingEvidenceId, setDeletingEvidenceId] = useState<string | null>(
    null,
  );
  const [optimisticState, setOptimisticState] = useOptimistic<
    OptimisticState,
    Partial<OptimisticState>
  >({ message: '', type: 'idle' }, (currentState, optimisticValue) => ({
    ...currentState,
    ...optimisticValue,
  }));
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EvidenceFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      type: 'project',
      title: '',
      description: '',
      issuedBy: '',
      issuedAt: '',
      expiresAt: '',
      skillId: 'none',
      linkUrl: '',
      linkLabel: '',
    },
  });

  const {
    register: editRegister,
    control: editControl,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    setError: setEditError,
    formState: { errors: editErrors, isSubmitting: isEditSubmitting },
  } = useForm<EvidenceFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      type: 'project',
      title: '',
      description: '',
      issuedBy: '',
      issuedAt: '',
      expiresAt: '',
      skillId: 'none',
      linkUrl: '',
      linkLabel: '',
    },
  });

  const { data: userEvidence, isLoading } = useGetUserEvidence();
  const { data: userSkills } = useGetUserSkills();
  const { mutateAsync: createUserEvidence, isPending: isCreating } =
    useCreateUserEvidence();
  const { mutateAsync: updateUserEvidence, isPending: isUpdating } =
    useUpdateUserEvidence();
  const { mutateAsync: deleteUserEvidence, isPending: isDeleting } =
    useDeleteUserEvidence();

  const totalEvidence = userEvidence?.length ?? 0;
  const linkedEvidence =
    userEvidence?.filter((item) => (item.skillLinks?.length ?? 0) > 0).length ??
    0;
  const readiness = totalEvidence > 0 ? 'Ready' : 'Needs evidence';

  const filteredEvidence = useMemo(() => {
    const source = userEvidence ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return source;
    return source.filter((item) => {
      return (
        item.title.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term)
      );
    });
  }, [search, userEvidence]);

  const onSubmit = async (values: EvidenceFormValues) => {
    startTransition(async () => {
      setOptimisticState({
        message: 'Saving evidence...',
        type: 'loading',
      });

      try {
        await createUserEvidence({
          type: values.type,
          title: values.title.trim(),
          description: values.description.trim() || null,
          issuedBy: values.issuedBy.trim() || null,
          issuedAt: toIsoDate(values.issuedAt),
          expiresAt: toIsoDate(values.expiresAt),
          skillIds: values.skillId !== 'none' ? [values.skillId] : undefined,
          links: values.linkUrl.trim()
            ? [
                {
                  url: values.linkUrl.trim(),
                  label: values.linkLabel.trim() || null,
                },
              ]
            : undefined,
        });

        reset({
          type: 'project',
          title: '',
          description: '',
          issuedBy: '',
          issuedAt: '',
          expiresAt: '',
          skillId: 'none',
          linkUrl: '',
          linkLabel: '',
        });

        setOptimisticState({
          message: 'Evidence created successfully.',
          type: 'success',
        });
      } catch (error) {
        setOptimisticState({
          message: '',
          type: 'error',
        });
        if (error instanceof ApiError) {
          setError('root', {
            type: 'server',
            message: error.message,
          });
          return;
        }

        setError('root', {
          type: 'server',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to create evidence.',
        });
      }
    });
  };

  const openEditDialog = (evidence: EvidenceWithRelations) => {
    setEditingEvidence(evidence);
    resetEditForm({
      type: evidence.type,
      title: evidence.title,
      description: evidence.description ?? '',
      issuedBy: evidence.issuedBy ?? '',
      issuedAt: toDateInput(evidence.issuedAt),
      expiresAt: toDateInput(evidence.expiresAt),
      skillId: evidence.skillLinks?.[0]?.id ?? 'none',
      linkUrl: evidence.links?.[0]?.url ?? '',
      linkLabel: evidence.links?.[0]?.label ?? '',
    });
  };

  const onSubmitEdit = async (values: EvidenceFormValues) => {
    if (!editingEvidence) return;

    startTransition(async () => {
      setOptimisticState({
        message: 'Updating evidence...',
        type: 'loading',
      });

      try {
        await updateUserEvidence({
          evidenceId: editingEvidence.id,
          data: {
            type: values.type,
            title: values.title.trim(),
            description: values.description.trim() || null,
            issuedBy: values.issuedBy.trim() || null,
            issuedAt: toIsoDate(values.issuedAt),
            expiresAt: toIsoDate(values.expiresAt),
            skillIds: values.skillId !== 'none' ? [values.skillId] : undefined,
            links: values.linkUrl.trim()
              ? [
                  {
                    url: values.linkUrl.trim(),
                    label: values.linkLabel.trim() || null,
                  },
                ]
              : undefined,
          },
        });
        setEditingEvidence(null);
        setOptimisticState({
          message: 'Evidence updated successfully.',
          type: 'success',
        });
      } catch (error) {
        setOptimisticState({
          message: '',
          type: 'error',
        });
        setEditError('root', {
          type: 'server',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to update evidence.',
        });
      }
    });
  };

  const handleDelete = async (evidenceId: string) => {
    try {
      await deleteUserEvidence(evidenceId);
      setDeletingEvidenceId(null);
    } catch (error) {
      setError('root', {
        type: 'server',
        message:
          error instanceof Error ? error.message : 'Failed to delete evidence.',
      });
    }
  };

  const deletingEvidence =
    (userEvidence ?? []).find((item) => item.id === deletingEvidenceId) ?? null;

  return (
    <div className="space-y-6">
      <UserWorkspaceHero
        title="Evidence"
        description="Add verifiable artifacts that support your skills and improve trust in your profile."
        actions={
          <Button variant="outline" asChild>
            <Link href={`/user/${userId}/dashboard`}>Back to dashboard</Link>
          </Button>
        }
        badges={[
          { label: 'Total', value: totalEvidence },
          { label: 'Linked', value: linkedEvidence, variant: 'outline' },
          { label: 'Readiness', value: readiness, variant: 'outline' },
        ]}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Add evidence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {optimisticState.type === 'loading' && (
              <Alert className="border-blue-200 bg-blue-50">
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>{optimisticState.message}</AlertDescription>
              </Alert>
            )}

            {optimisticState.type === 'success' && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  {optimisticState.message}
                </AlertDescription>
              </Alert>
            )}

            {errors.root && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.root.message}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Type</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) =>
                        field.onChange(value as EvidenceType)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EVIDENCE_TYPES.map((item) => (
                          <SelectItem key={item} value={item}>
                            {toTitle(item)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-medium">Title</Label>
                <Input
                  placeholder="Portfolio project"
                  disabled={isSubmitting || isPending || isCreating}
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                disabled={isSubmitting || isPending || isCreating}
                {...register('description')}
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Issued by</Label>
                <Input
                  placeholder="Issuer"
                  disabled={isSubmitting || isPending || isCreating}
                  {...register('issuedBy')}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Issued at</Label>
                <Input
                  type="date"
                  disabled={isSubmitting || isPending || isCreating}
                  {...register('issuedAt')}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Expires at</Label>
                <Input
                  type="date"
                  disabled={isSubmitting || isPending || isCreating}
                  {...register('expiresAt')}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Linked skill</Label>
                <Controller
                  name="skillId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {(userSkills ?? []).map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.skill?.name ?? item.skillId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Link URL</Label>
                <Input
                  placeholder="https://"
                  disabled={isSubmitting || isPending || isCreating}
                  {...register('linkUrl')}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Link label</Label>
                <Input
                  placeholder="Repository"
                  disabled={isSubmitting || isPending || isCreating}
                  {...register('linkLabel')}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="submit"
                disabled={isSubmitting || isPending || isCreating}
              >
                {isPending || isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Create evidence'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Your submissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Search evidence..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
                <Badge variant="outline" className="self-start sm:self-auto">
                  {filteredEvidence.length} items
                </Badge>
              </div>

              <Separator />

              <div className="grid gap-3">
                {isLoading ? (
                  <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                    Loading evidence...
                  </div>
                ) : filteredEvidence.length > 0 ? (
                  filteredEvidence.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="text-lg font-semibold">{item.title}</div>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {item.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(item)}
                        >
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/user/${userId}/evidence/${item.id}`}>
                            Open
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingEvidenceId(item.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                    No evidence available yet.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Readiness</div>
                  <Badge variant={totalEvidence > 0 ? 'secondary' : 'outline'}>
                    {readiness}
                  </Badge>
                </div>
                <div className="text-sm font-medium">Evidence quality</div>
                <div className="text-sm text-muted-foreground">
                  Keep evidence linked to skills to improve explainability in
                  role matches.
                </div>
              </div>
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground">Total evidence</div>
                  <div className="font-medium">{totalEvidence}</div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground">Linked to skills</div>
                  <div className="font-medium">{linkedEvidence}</div>
                </div>
                <Separator />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" />
                  Evidence-backed claims increase matching trust.
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  Keep at least one recent artifact for top skills.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={Boolean(editingEvidence)}
        onOpenChange={(open) => {
          if (!open) setEditingEvidence(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit evidence</AlertDialogTitle>
            <AlertDialogDescription>
              Update evidence details and linked skill metadata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form onSubmit={handleEditSubmit(onSubmitEdit)} className="space-y-3">
            {editErrors.root && (
              <Alert variant="destructive">
                <AlertDescription>{editErrors.root.message}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Type</Label>
                <Controller
                  name="type"
                  control={editControl}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) =>
                        field.onChange(value as EvidenceType)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EVIDENCE_TYPES.map((item) => (
                          <SelectItem key={item} value={item}>
                            {toTitle(item)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Title</Label>
                <Input
                  disabled={isEditSubmitting || isPending || isUpdating}
                  {...editRegister('title', { required: 'Title is required' })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                disabled={isEditSubmitting || isPending || isUpdating}
                {...editRegister('description')}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Issued by</Label>
                <Input
                  disabled={isEditSubmitting || isPending || isUpdating}
                  {...editRegister('issuedBy')}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Linked skill</Label>
                <Controller
                  name="skillId"
                  control={editControl}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {(userSkills ?? []).map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.skill?.name ?? item.skillId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Issued at</Label>
                <Input type="date" {...editRegister('issuedAt')} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Expires at</Label>
                <Input type="date" {...editRegister('expiresAt')} />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Link URL</Label>
                <Input {...editRegister('linkUrl')} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Link label</Label>
                <Input {...editRegister('linkLabel')} />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button type="button" variant="outline" disabled={isUpdating}>
                  Cancel
                </Button>
              </AlertDialogCancel>
              <Button
                type="submit"
                disabled={isEditSubmitting || isPending || isUpdating}
              >
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

      <AlertDialog
        open={Boolean(deletingEvidenceId)}
        onOpenChange={(open) => {
          if (!open) setDeletingEvidenceId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this evidence?</AlertDialogTitle>
            <AlertDialogDescription>
              This action permanently deletes the selected evidence.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="text-sm text-muted-foreground">
            This will permanently remove{' '}
            <span className="font-medium text-foreground">
              {deletingEvidence?.title ?? 'this evidence'}
            </span>
            .
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={() => {
                if (deletingEvidenceId) {
                  void handleDelete(deletingEvidenceId);
                }
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete evidence'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
