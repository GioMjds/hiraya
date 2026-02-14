'use client';

import { useState } from 'react';
import Link from 'next/link';
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
} from '@/features/authorized/admin/hooks';

export function AdminCapabilitiesClient() {
  const [search, setSearch] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const { data: capabilities, isLoading } = useGetAdminCapabilities();
  const { mutateAsync: createCapability, isPending: isCreating } = useCreateAdminCapability();
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Capabilities</h1>
          <p className="text-sm text-muted-foreground">
            Maintain capability definitions and their edges to skills.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin">Back to dashboard</Link>
          </Button>
        </div>
      </div>

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
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        disabled={isArchiving}
                        onClick={async () => await archiveCapability(capability.id)}
                      >
                        Archive capability
                      </Button>
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
    </div>
  );
}
