import Link from 'next/link';
import type { Route } from 'next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, FolderCheck, Sparkles, Target, User } from 'lucide-react';

const QUICK_ACTIONS = [
  {
    title: 'Update profile',
    description: 'Headline, summary, and onboarding goal.',
    icon: User,
    href: (userID: string) => `/user/${userID}/profile` as Route,
  },
  {
    title: 'Manage skills',
    description: 'Add skills and set proficiency.',
    icon: Sparkles,
    href: (userID: string) => `/user/${userID}/skills` as Route,
  },
  {
    title: 'Add evidence',
    description: 'Attach artifacts that validate claims.',
    icon: FolderCheck,
    href: (userID: string) => `/user/${userID}/evidence` as Route,
  },
  {
    title: 'View matches',
    description: 'See your fit score per role.',
    icon: Target,
    href: (userID: string) => `/user/${userID}/matches` as Route,
  },
] as const;

export default async function Page({
  params,
}: PageProps<'/user/[userID]/dashboard'>) {
  const { userID } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Evidence-backed skills, capability matching, and next best actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/user/${userID}/recommendations`}>Recommendations</Link>
          </Button>
          <Button asChild>
            <Link href={`/user/${userID}/matches`}>
              Open matches
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Skill coverage', value: '—', note: 'Skills you declared' },
          { label: 'Verified evidence', value: '—', note: 'Artifacts approved' },
          { label: 'Matches generated', value: '—', note: 'Role fit results' },
          { label: 'Skill gaps', value: '—', note: 'Highest impact gaps' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-2xl font-semibold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.note}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {QUICK_ACTIONS.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto justify-start p-4"
                asChild
              >
                <Link href={action.href(userID)}>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-md border bg-background p-2">
                      <action.icon className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {action.description}
                      </div>
                    </div>
                  </div>
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Onboarding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Survey</div>
              <Badge variant="secondary">In progress</Badge>
            </div>
            <Separator />
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium">Suggested next step</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Add at least one piece of evidence to strengthen your top skills.
              </div>
              <Button size="sm" className="mt-3" asChild>
                <Link href={`/user/${userID}/evidence`}>Add evidence</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
