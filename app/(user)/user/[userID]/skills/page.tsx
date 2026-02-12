import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Plus, Search, Sparkles } from 'lucide-react';

const SAMPLE_USER_SKILLS = [
  { id: 'mock-skill-1', name: 'TypeScript', level: 'INTERMEDIATE', confidence: 70 },
  { id: 'mock-skill-2', name: 'Next.js', level: 'BEGINNER', confidence: 55 },
  { id: 'mock-skill-3', name: 'NestJS', level: 'BEGINNER', confidence: 50 },
  { id: 'mock-skill-4', name: 'SQL', level: 'INTERMEDIATE', confidence: 65 },
] as const;

export default async function Page({ params }: PageProps<'/user/[userID]/skills'>) {
  const { userID } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Skills</h1>
          <p className="text-sm text-muted-foreground">
            Declare skills and link evidence to validate them.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/user/${userID}/dashboard`}>Back</Link>
          </Button>
          <Button>
            <Plus className="mr-1 h-4 w-4" />
            Add skill
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">Your skill map</CardTitle>
            <Sparkles className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search your skills..." />
          </div>

          <Separator />

          <div className="grid gap-3">
            {SAMPLE_USER_SKILLS.map((skill) => (
              <div
                key={skill.id}
                className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-medium">{skill.name}</div>
                  <div className="text-xs text-muted-foreground">Confidence: {skill.confidence}%</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {skill.level}
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/user/${userID}/skills/${skill.id}`}>
                      Open
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
