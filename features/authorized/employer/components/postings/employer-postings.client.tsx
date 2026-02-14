'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
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
  useCloseRolePosting,
  useCreateRolePosting,
  useGetEmployerPostings,
  useGetEmployerRoles,
  usePublishRolePosting,
  useUpdateRolePosting,
} from '@/features/authorized/employer/hooks';
import type { EmployerPostingListItem } from '@/lib/api/authorized/employer';
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  Plus,
  Search,
  Target,
} from 'lucide-react';
import { EmployerWorkspaceHero } from '../shared/employer-workspace-hero';

interface EmployerPostingsClientProps {
  employerId: string;
}

interface CreatePostingFormState {
  roleId: string;
  location: string;
  employmentType: string;
  salaryMin: string;
  salaryMax: string;
  currency: string;
  description: string;
}

interface EditPostingFormState {
  location: string;
  employmentType: string;
  salaryMin: string;
  salaryMax: string;
  currency: string;
  description: string;
}

const INITIAL_CREATE_FORM: CreatePostingFormState = {
  roleId: '',
  location: '',
  employmentType: '',
  salaryMin: '',
  salaryMax: '',
  currency: '',
  description: '',
};

const INITIAL_EDIT_FORM: EditPostingFormState = {
  location: '',
  employmentType: '',
  salaryMin: '',
  salaryMax: '',
  currency: '',
  description: '',
};

const toNumber = (value: string): number | undefined => {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export function EmployerPostingsClient({ employerId }: EmployerPostingsClientProps) {
  const [search, setSearch] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState<CreatePostingFormState>(INITIAL_CREATE_FORM);
  const [editingPosting, setEditingPosting] = useState<EmployerPostingListItem | null>(
    null,
  );
  const [editForm, setEditForm] = useState<EditPostingFormState>(INITIAL_EDIT_FORM);
  const [publishPosting, setPublishPosting] = useState<EmployerPostingListItem | null>(
    null,
  );
  const [closePosting, setClosePosting] = useState<EmployerPostingListItem | null>(null);

  const { data: postings = [] } = useGetEmployerPostings();
  const { data: roles = [] } = useGetEmployerRoles();
  const { mutateAsync: createPosting, isPending: isCreating } = useCreateRolePosting();
  const { mutateAsync: updatePosting, isPending: isUpdating } = useUpdateRolePosting();
  const { mutateAsync: publishRolePosting, isPending: isPublishing } =
    usePublishRolePosting();
  const { mutateAsync: closeRolePosting, isPending: isClosing } = useCloseRolePosting();

  const filteredPostings = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return postings;

    return postings.filter((posting) => {
      const title = posting.role?.title?.toLowerCase() ?? '';
      return (
        title.includes(term) ||
        posting.id.toLowerCase().includes(term) ||
        posting.status.toLowerCase().includes(term)
      );
    });
  }, [postings, search]);

  const openPostings = postings.filter((posting) => posting.status === 'open').length;

  const handleCreatePosting = async () => {
    if (!createForm.roleId) {
      setFormError('Please select a role.');
      return;
    }

    setFormError('');
    try {
      await createPosting({
        roleId: createForm.roleId,
        location: createForm.location.trim() || undefined,
        employmentType: createForm.employmentType.trim() || undefined,
        salaryMin: toNumber(createForm.salaryMin),
        salaryMax: toNumber(createForm.salaryMax),
        currency: createForm.currency.trim() || undefined,
        description: createForm.description.trim() || undefined,
      });
      setCreateForm(INITIAL_CREATE_FORM);
      setIsCreateOpen(false);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Failed to create posting.',
      );
    }
  };

  const openEditPosting = (posting: EmployerPostingListItem) => {
    setFormError('');
    setEditingPosting(posting);
    setEditForm({
      location: posting.location ?? '',
      employmentType: posting.employmentType ?? '',
      salaryMin: posting.salaryMin === null ? '' : String(posting.salaryMin),
      salaryMax: posting.salaryMax === null ? '' : String(posting.salaryMax),
      currency: posting.currency ?? '',
      description: posting.description ?? '',
    });
  };

  const handleUpdatePosting = async () => {
    if (!editingPosting) return;

    setFormError('');
    try {
      await updatePosting({
        postingId: editingPosting.id,
        data: {
          location: editForm.location.trim() || undefined,
          employmentType: editForm.employmentType.trim() || undefined,
          salaryMin: toNumber(editForm.salaryMin),
          salaryMax: toNumber(editForm.salaryMax),
          currency: editForm.currency.trim() || undefined,
          description: editForm.description.trim() || undefined,
        },
      });
      setEditingPosting(null);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Failed to update posting.',
      );
    }
  };

  const handlePublish = async () => {
    if (!publishPosting) return;

    setFormError('');
    try {
      await publishRolePosting(publishPosting.id);
      setPublishPosting(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to publish posting.');
    }
  };

  const handleClose = async () => {
    if (!closePosting) return;

    setFormError('');
    try {
      await closeRolePosting(closePosting.id);
      setClosePosting(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to close posting.');
    }
  };

  return (
    <div className="space-y-6">
      <EmployerWorkspaceHero
        title="Postings"
        description="Publish role-linked postings with clear expectations to improve candidate quality."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href={`/employer/${employerId}/dashboard`}>Back to dashboard</Link>
            </Button>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-1 h-4 w-4" />
              New posting
            </Button>
          </>
        }
        badges={[
          { label: 'Total', value: postings.length },
          { label: 'Open', value: openPostings, variant: 'outline' },
        ]}
      />

      <Card className="border-border/80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">All postings</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search postings..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <Separator />
              <div className="grid gap-3">
                {filteredPostings.length === 0 ? (
                  <div className="rounded-lg border border-border/80 p-6 text-sm text-muted-foreground">
                    No postings yet.
                  </div>
                ) : (
                  filteredPostings.map((posting) => (
                    <div
                      key={posting.id}
                      className="rounded-lg border border-border/80 p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="font-medium">
                          {posting.role?.title ?? `Role ${posting.roleId}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Posting ID: {posting.id}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant={posting.status === 'open' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {posting.status.toUpperCase()}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => openEditPosting(posting)}>
                          Edit
                        </Button>
                        {posting.status === 'draft' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPublishPosting(posting)}
                          >
                            Publish
                          </Button>
                        )}
                        {posting.status === 'open' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setClosePosting(posting)}
                          >
                            Close
                          </Button>
                        )}
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/employer/${employerId}/postings/${posting.id}`}>
                            Open
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg border border-border/80 p-4 space-y-2">
                <div className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Pipeline focus
                </div>
                <div className="text-sm text-muted-foreground">
                  Keep posting details role-specific so fit scoring remains reliable and
                  explainable.
                </div>
              </div>
              <div className="rounded-lg border border-border/80 p-4 space-y-2">
                <div className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Posting health
                </div>
                <div className="text-sm text-muted-foreground">
                  Draft postings should include clear role capabilities before opening.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create posting</AlertDialogTitle>
            <AlertDialogDescription>
              Create a role-linked posting draft for publication.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            {formError && <div className="text-sm text-destructive">{formError}</div>}
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={createForm.roleId}
                onValueChange={(value) =>
                  setCreateForm((prev) => ({ ...prev, roleId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={createForm.location}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, location: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Employment type</Label>
                <Input
                  value={createForm.employmentType}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      employmentType: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Salary min</Label>
                <Input
                  type="number"
                  value={createForm.salaryMin}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, salaryMin: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Salary max</Label>
                <Input
                  type="number"
                  value={createForm.salaryMax}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, salaryMax: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input
                  value={createForm.currency}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, currency: event.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={createForm.description}
                onChange={(event) =>
                  setCreateForm((prev) => ({ ...prev, description: event.target.value }))
                }
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isCreating}
                  onClick={() => setFormError('')}
                >
                  Cancel
                </Button>
              </AlertDialogCancel>
              <Button
                type="button"
                disabled={isCreating}
                onClick={() => void handleCreatePosting()}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save draft'
                )}
              </Button>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(editingPosting)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingPosting(null);
            setFormError('');
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit posting</AlertDialogTitle>
            <AlertDialogDescription>
              Update posting details and compensation metadata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            {formError && <div className="text-sm text-destructive">{formError}</div>}
            <div className="rounded-lg border p-3 text-sm">
              <div className="font-medium">{editingPosting?.role?.title ?? 'Posting'}</div>
              <div className="text-muted-foreground">Role-linked posting</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={editForm.location}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, location: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Employment type</Label>
                <Input
                  value={editForm.employmentType}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      employmentType: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Salary min</Label>
                <Input
                  type="number"
                  value={editForm.salaryMin}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, salaryMin: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Salary max</Label>
                <Input
                  type="number"
                  value={editForm.salaryMax}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, salaryMax: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input
                  value={editForm.currency}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, currency: event.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={editForm.description}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, description: event.target.value }))
                }
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button type="button" variant="outline" disabled={isUpdating}>
                  Cancel
                </Button>
              </AlertDialogCancel>
              <Button
                type="button"
                disabled={isUpdating}
                onClick={() => void handleUpdatePosting()}
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
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(publishPosting)}
        onOpenChange={(open) => {
          if (!open) setPublishPosting(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish this posting?</AlertDialogTitle>
            <AlertDialogDescription>
              Publishing will expose this posting to candidates.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="text-sm text-muted-foreground">
            This will make{' '}
            <span className="font-medium text-foreground">
              {publishPosting?.role?.title ?? 'the posting'}
            </span>{' '}
            visible to candidates.
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline" disabled={isPublishing}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button type="button" disabled={isPublishing} onClick={() => void handlePublish()}>
              {isPublishing ? 'Publishing...' : 'Publish posting'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(closePosting)}
        onOpenChange={(open) => {
          if (!open) setClosePosting(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close this posting?</AlertDialogTitle>
            <AlertDialogDescription>
              Closing stops new candidate activity for this posting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="text-sm text-muted-foreground">
            This will stop new activity for{' '}
            <span className="font-medium text-foreground">
              {closePosting?.role?.title ?? 'the posting'}
            </span>
            .
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline" disabled={isClosing}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={isClosing}
              onClick={() => void handleClose()}
            >
              {isClosing ? 'Closing...' : 'Close posting'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
