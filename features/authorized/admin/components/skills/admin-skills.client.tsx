'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import { Separator } from '@/components/ui/separator';
import { Plus, Search, Sparkles } from 'lucide-react';
import {
  useArchiveAdminSkill,
  useCreateAdminSkill,
  useGetAdminSkills,
  useUpdateAdminSkill,
} from '@/features/authorized/admin/hooks';
import type { AdminSkill } from '@/lib/api/authorized/admin';
import { AdminWorkspaceHero } from '../shared/admin-workspace-hero';

export function AdminSkillsClient() {
  const [search, setSearch] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<AdminSkill | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');

  const { data: skills, isLoading } = useGetAdminSkills();
  const { mutateAsync: createSkill, isPending: isCreating } = useCreateAdminSkill();
  const { mutateAsync: updateSkill, isPending: isUpdating } = useUpdateAdminSkill();
  const { mutateAsync: archiveSkill, isPending: isArchiving } = useArchiveAdminSkill();

  const filteredSkills = (skills ?? []).filter((skill) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      skill.name.toLowerCase().includes(term) ||
      (skill.description ?? '').toLowerCase().includes(term)
    );
  });

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createSkill({
      name: name.trim(),
      description: description.trim() || undefined,
    });
    setName('');
    setDescription('');
  };

  const openEdit = (skill: AdminSkill) => {
    setSelectedSkill(skill);
    setEditName(skill.name);
    setEditDescription(skill.description ?? '');
  };

  const handleSaveEdit = async () => {
    if (!selectedSkill || !editName.trim()) return;
    await updateSkill({
      id: selectedSkill.id,
      data: {
        name: editName.trim(),
        description: editDescription.trim() || undefined,
      },
    });
    setSelectedSkill(null);
  };

  const totalSkills = skills?.length ?? 0;

  return (
    <div className="space-y-6">
      <AdminWorkspaceHero
        title="Skills"
        description="Maintain skill taxonomy quality and archive outdated entries safely."
        actions={
          <Button variant="outline" asChild>
            <Link href="/admin">Back to dashboard</Link>
          </Button>
        }
        badges={[
          { label: 'Total skills', value: totalSkills },
          { label: 'Filtered', value: filteredSkills.length, variant: 'outline' },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/80 lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <CardTitle className="text-base">All skills</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search skills..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <Separator />
            <div className="grid gap-3">
              {isLoading ? (
                <div className="rounded-lg border border-border/80 p-6 text-sm text-muted-foreground">
                  Loading skills...
                </div>
              ) : filteredSkills.length === 0 ? (
                <div className="rounded-lg border border-border/80 p-6 text-sm text-muted-foreground">
                  No skills found.
                </div>
              ) : (
                filteredSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex flex-col gap-2 rounded-lg border border-border/80 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="font-medium">{skill.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {skill.description ?? 'No description'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">ACTIVE</Badge>
                      <Button variant="outline" size="sm" onClick={() => openEdit(skill)}>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isArchiving}
                        onClick={async () => await archiveSkill(skill.id)}
                      >
                        Archive
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="text-base">Add skill</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <Input
              placeholder="Skill name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Input
              placeholder="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <Button className="w-full" disabled={!name.trim() || isCreating} onClick={handleCreate}>
              <Plus className="mr-1 h-4 w-4" />
              Add skill
            </Button>
          </CardContent>
        </Card>
      </div>

      <AlertDialog
        open={Boolean(selectedSkill)}
        onOpenChange={(open) => {
          if (!open) setSelectedSkill(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit skill</AlertDialogTitle>
            <AlertDialogDescription>
              Update canonical skill taxonomy metadata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Skill name"
              value={editName}
              onChange={(event) => setEditName(event.target.value)}
            />
            <Input
              placeholder="Description"
              value={editDescription}
              onChange={(event) => setEditDescription(event.target.value)}
            />
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button type="button" variant="outline" disabled={isUpdating}>
                  Cancel
                </Button>
              </AlertDialogCancel>
              <Button type="button" disabled={isUpdating || !editName.trim()} onClick={handleSaveEdit}>
                {isUpdating ? 'Saving...' : 'Save'}
              </Button>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
