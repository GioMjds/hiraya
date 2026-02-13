import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Network, Plus, Search } from 'lucide-react';

const capabilities: Array<{ name: string; slug: string; edges: number }> = [];

export default function Page() {
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
          <Button>
            <Plus className="mr-1 h-4 w-4" />
            Add capability
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">Capability graph</CardTitle>
            <Network className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search capabilities..." />
          </div>

          <Separator />

          <div className="grid gap-3 sm:grid-cols-2">
            {capabilities.length === 0 ? (
              <div className="rounded-lg border p-6 text-sm text-muted-foreground sm:col-span-2">
                No capabilities available yet.
              </div>
            ) : (
              capabilities.map((capability) => (
                <Card key={capability.slug} className="py-4">
                  <CardContent className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{capability.name}</div>
                        <div className="text-xs text-muted-foreground">Slug: {capability.slug}</div>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {capability.edges} edges
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Manage edges
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
