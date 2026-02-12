import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Plus, Search, Sparkles } from 'lucide-react';

const SAMPLE_SKILLS = [
  { name: 'TypeScript', slug: 'typescript', state: 'ACTIVE' },
  { name: 'Next.js', slug: 'nextjs', state: 'ACTIVE' },
  { name: 'NestJS', slug: 'nestjs', state: 'ACTIVE' },
  { name: 'Graph Modeling', slug: 'graph-modeling', state: 'DRAFT' },
] as const;

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Skills</h1>
          <p className="text-sm text-muted-foreground">
            Manage the skill taxonomy and activation states.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin">Back to dashboard</Link>
          </Button>
          <Button>
            <Plus className="mr-1 h-4 w-4" />
            Add skill
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <CardTitle className="text-base">All skills</CardTitle>
              <Sparkles className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search skills..." />
            </div>
            <Separator />
            <div className="grid gap-3">
              {SAMPLE_SKILLS.map((skill) => (
                <div
                  key={skill.slug}
                  className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="font-medium">{skill.name}</div>
                    <div className="text-xs text-muted-foreground">Slug: {skill.slug}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={skill.state === 'ACTIVE' ? 'secondary' : 'outline'}>
                      {skill.state}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="rounded-lg border p-3">
              Keep names human-friendly and stable.
            </div>
            <div className="rounded-lg border p-3">
              Use slugs for consistent routing and matching.
            </div>
            <div className="rounded-lg border p-3">
              Deactivate instead of deleting to preserve history.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
