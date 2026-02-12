import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Lightbulb } from 'lucide-react';

const SAMPLE_RECOMMENDATIONS = [
  {
    title: 'Full-Stack Developer',
    reason: 'Strong overlap in declared skills; add evidence for backend work to boost confidence.',
    next: 'Add evidence for APIs and data modeling.',
  },
  {
    title: 'Frontend Developer',
    reason: 'High alignment in UI skill cluster and related capabilities.',
    next: 'Declare accessibility and testing skills.',
  },
  {
    title: 'Backend Developer',
    reason: 'Moderate alignment; gaps in database and architecture capabilities.',
    next: 'Close gaps by adding structured learning evidence.',
  },
] as const;

export default async function Page({
  params,
}: PageProps<'/user/[userID]/recommendations'>) {
  const { userID } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Recommendations</h1>
          <p className="text-sm text-muted-foreground">
            Suggested roles and actions based on your capability graph (mock).
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/user/${userID}/dashboard`}>Back</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">Suggested next roles</CardTitle>
            <Lightbulb className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {SAMPLE_RECOMMENDATIONS.map((rec) => (
              <div key={rec.title} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="font-medium">{rec.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{rec.reason}</div>
                  </div>
                  <Badge variant="secondary">Suggested</Badge>
                </div>
                <Separator />
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-muted-foreground">Next action: {rec.next}</div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/user/${userID}/matches`}>
                      View matches
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
