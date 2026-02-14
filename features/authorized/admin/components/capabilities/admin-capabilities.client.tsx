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
import { Network, Plus, Search } from 'lucide-react';
import {
  useArchiveAdminCapability,
  useCreateAdminCapability,
  useGetAdminCapabilities,
  useUpdateAdminCapability,
} from '@/features/authorized/admin/hooks';
import type { AdminCapability } from '@/lib/api/authorized/admin';
import { AdminWorkspaceHero } from '../shared/admin-workspace-hero';

export function AdminCapabilitiesClient() {
  const [search, setSearch] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedCapability, setSelectedCapability] =
    useState<AdminCapability | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');

  const { data: capabilities, isLoading } = useGetAdminCapabilities();
  const { mutateAsync: createCapability, isPending: isCreating } = useCreateAdminCapability();
  const { mutateAsync: updateCapability, isPending: isUpdating } =
    useUpdateAdminCapability();
  const { mutateAsync: archiveCapability, isPending: isArchiving } = useArchiveAdminCapability();

  const filteredCapabilities = (capabilities ?? []).filter((capability) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      capability.name.toLowerCase().includes(term) ||
      (capability.description ?? '').toLowerCase().includes(term)
    );
  });

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createCapability({
      name: name.trim(),
      description: description.trim() || undefined,
    });
    setName('');
    setDescription('');
  };

  const openEdit = (capability: AdminCapability) => {
    setSelectedCapability(capability);
    setEditName(capability.name);
    setEditDescription(capability.description ?? '');
  };

  const handleSaveEdit = async () => {
    if (!selectedCapability || !editName.trim()) return;
    await updateCapability({
      id: selectedCapability.id,
      data: {
        name: editName.trim(),
        description: editDescription.trim() || undefined,
      },
    });
    setSelectedCapability(null);
  };

  const totalCapabilities = capabilities?.length ?? 0;

  return (
    <div className="space-y-6">
      <AdminWorkspaceHero
        title="Capabilities"
        description="Keep the capability graph consistent so matching and recommendations stay explainable."
        actions={
          <Button variant="outline" asChild>
            <Link href="/admin">Back to dashboard</Link>
          </Button>
        }
        badges={[
          { label: 'Total capabilities', value: totalCapabilities },
          {
            label: 'Filtered',
            value: filteredCapabilities.length,
            variant: 'outline',
          },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/80 lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <CardTitle className="text-base">Capability graph</CardTitle>
              <Network className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search capabilities..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <Separator />

            <div className="grid gap-3 sm:grid-cols-2">
              {isLoading ? (
                <div className="rounded-lg border border-border/80 p-6 text-sm text-muted-foreground sm:col-span-2">
                  Loading capabilities...
                </div>
              ) : filteredCapabilities.length === 0 ? (
                <div className="rounded-lg border border-border/80 p-6 text-sm text-muted-foreground sm:col-span-2">
                  No capabilities found.
                </div>
              ) : (
                filteredCapabilities.map((capability) => (
                  <Card key={capability.id} className="border-border/80 py-4">
                    <CardContent className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{capability.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {capability.description ?? 'No description'}
                          </div>
                        </div>
                       <Badge variant="secondary" className="shrink-0">
                          Active
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isUpdating}
                          onClick={() => openEdit(capability)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isArchiving}
                          onClick={async () => await archiveCapability(capability.id)}
                        >
                          Archive
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="text-base">Add capability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <Input
              placeholder="Capability name"
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
              Add capability
            </Button>
          </CardContent>
        </Card>
      </div>

      <AlertDialog
        open={Boolean(selectedCapability)}
        onOpenChange={(open) => {
          if (!open) setSelectedCapability(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit capability</AlertDialogTitle>
            <AlertDialogDescription>
              Update capability metadata used by role requirement mapping.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Capability name"
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
              <Button
                type="button"
                disabled={isUpdating || !editName.trim()}
                onClick={handleSaveEdit}
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </Button>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
