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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  useArchiveEmployerRole,
  useCreateEmployerRole,
  useGetEmployerRoles,
  useUpdateEmployerRole,
} from '@/features/authorized/employer/hooks';
import type { EmployerRole } from '@/lib/api/authorized/employer';
import { ArrowRight, Briefcase, Loader2, Plus, Search } from 'lucide-react';
import { EmployerWorkspaceHero } from '../shared/employer-workspace-hero';

interface EmployerRolesClientProps {
  employerId: string;
}

interface RoleFormState {
  title: string;
  slug: string;
  description: string;
}

const INITIAL_ROLE_FORM: RoleFormState = {
  title: '',
  slug: '',
  description: '',
};

export function EmployerRolesClient({ employerId }: EmployerRolesClientProps) {
  const [search, setSearch] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState<RoleFormState>(INITIAL_ROLE_FORM);
  const [editingRole, setEditingRole] = useState<EmployerRole | null>(null);
  const [editForm, setEditForm] = useState<RoleFormState>(INITIAL_ROLE_FORM);
  const [archivingRole, setArchivingRole] = useState<EmployerRole | null>(null);

  const { data: roles = [] } = useGetEmployerRoles();
  const { mutateAsync: createRole, isPending: isCreating } = useCreateEmployerRole();
  const { mutateAsync: updateRole, isPending: isUpdating } = useUpdateEmployerRole();
  const { mutateAsync: archiveRole, isPending: isArchiving } = useArchiveEmployerRole();

  const filteredRoles = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return roles;

    return roles.filter((role) => {
      return (
        role.title.toLowerCase().includes(term) ||
        role.id.toLowerCase().includes(term) ||
        (role.description ?? '').toLowerCase().includes(term)
      );
    });
  }, [roles, search]);

  const publishedRoles = roles.filter((role) => role.status === 'published').length;

  const handleCreateRole = async () => {
    if (!createForm.title.trim()) {
      setFormError('Role title is required.');
      return;
    }

    setFormError('');
    try {
      await createRole({
        title: createForm.title.trim(),
        slug: createForm.slug.trim() || undefined,
        description: createForm.description.trim() || undefined,
      });
      setCreateForm(INITIAL_ROLE_FORM);
      setIsCreateOpen(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to create role.');
    }
  };

  const openEditRole = (role: EmployerRole) => {
    setFormError('');
    setEditingRole(role);
    setEditForm({
      title: role.title,
      slug: role.slug,
      description: role.description ?? '',
    });
  };

  const handleUpdateRole = async () => {
    if (!editingRole || !editForm.title.trim()) {
      setFormError('Role title is required.');
      return;
    }

    setFormError('');
    try {
      await updateRole({
        roleId: editingRole.id,
        data: {
          title: editForm.title.trim(),
          slug: editForm.slug.trim() || undefined,
          description: editForm.description.trim() || undefined,
        },
      });
      setEditingRole(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to update role.');
    }
  };

  const handleArchiveRole = async () => {
    if (!archivingRole) return;

    setFormError('');
    try {
      await archiveRole(archivingRole.id);
      setArchivingRole(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to archive role.');
    }
  };

  return (
    <div className="space-y-6">
      <EmployerWorkspaceHero
        title="Roles"
        description="Define role requirements clearly so postings and match decisions stay consistent."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href={`/employer/${employerId}/dashboard`}>Back to dashboard</Link>
            </Button>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-1 h-4 w-4" />
              New role
            </Button>
          </>
        }
        badges={[
          { label: 'Total', value: roles.length },
          { label: 'Published', value: publishedRoles, variant: 'outline' },
        ]}
      />

      <Card className="border-border/80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">Role library</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search roles..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Separator />
          <div className="grid gap-3">
            {filteredRoles.length === 0 ? (
              <div className="rounded-lg border border-border/80 p-6 text-sm text-muted-foreground">
                No roles yet.
              </div>
            ) : (
              filteredRoles.map((role) => (
                <div
                  key={role.id}
                  className="rounded-lg border border-border/80 p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="font-medium">{role.title}</div>
                    <div className="text-xs text-muted-foreground">Role ID: {role.id}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={role.status === 'published' ? 'secondary' : 'outline'}
                      className="uppercase"
                    >
                      {role.status.toUpperCase()}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => openEditRole(role)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setArchivingRole(role)}
                    >
                      Archive
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/employer/${employerId}/roles/${role.id}`}>
                        Open
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create role</AlertDialogTitle>
            <AlertDialogDescription>
              Create a new role for your organization.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            {formError && <div className="text-sm text-destructive">{formError}</div>}
            <div className="space-y-2">
              <Label htmlFor="create-role-title">Title</Label>
              <Input
                id="create-role-title"
                value={createForm.title}
                onChange={(event) =>
                  setCreateForm((prev) => ({ ...prev, title: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-role-slug">Slug</Label>
              <Input
                id="create-role-slug"
                value={createForm.slug}
                onChange={(event) =>
                  setCreateForm((prev) => ({ ...prev, slug: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-role-description">Description</Label>
              <Textarea
                id="create-role-description"
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
              <Button type="button" disabled={isCreating} onClick={() => void handleCreateRole()}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create role'
                )}
              </Button>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(editingRole)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingRole(null);
            setFormError('');
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit role</AlertDialogTitle>
            <AlertDialogDescription>
              Update role title, slug, and description.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            {formError && <div className="text-sm text-destructive">{formError}</div>}
            <div className="space-y-2">
              <Label htmlFor="edit-role-title">Title</Label>
              <Input
                id="edit-role-title"
                value={editForm.title}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, title: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role-slug">Slug</Label>
              <Input
                id="edit-role-slug"
                value={editForm.slug}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, slug: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role-description">Description</Label>
              <Textarea
                id="edit-role-description"
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
              <Button type="button" disabled={isUpdating} onClick={() => void handleUpdateRole()}>
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
        open={Boolean(archivingRole)}
        onOpenChange={(open) => {
          if (!open) setArchivingRole(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive this role?</AlertDialogTitle>
            <AlertDialogDescription>
              Archived roles are no longer active for new posting workflows.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="text-sm text-muted-foreground">
            Role{' '}
            <span className="font-medium text-foreground">
              {archivingRole?.title ?? 'selected role'}
            </span>{' '}
            will no longer be active for new workflows.
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline" disabled={isArchiving}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={isArchiving}
              onClick={() => void handleArchiveRole()}
            >
              {isArchiving ? 'Archiving...' : 'Archive role'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
