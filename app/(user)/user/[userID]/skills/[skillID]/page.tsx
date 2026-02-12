import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default async function Page({
  params,
}: PageProps<'/user/[userID]/skills/[skillID]'>) {
  const { userID, skillID } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Skill detail</h1>
          <p className="text-sm text-muted-foreground">
            Mock view showing proficiency, linked evidence, and related capabilities.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/user/${userID}/skills`}>Back to skills</Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-sm text-muted-foreground">Skill</div>
                  <div className="text-lg font-semibold">{skillID}</div>
                </div>
                <Badge variant="secondary">INTERMEDIATE</Badge>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="text-sm font-medium">Confidence</div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-[70%] bg-primary" />
                </div>
                <div className="text-xs text-muted-foreground">70% (mock)</div>
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-3">
              <div className="text-sm font-medium">Linked evidence</div>
              <div className="grid gap-2">
                {[
                  { id: 'mock-evidence-1', label: 'Project artifact', state: 'PENDING' },
                  { id: 'mock-evidence-2', label: 'Repository link', state: 'VERIFIED' },
                ].map((row) => (
                  <div
                    key={row.id}
                    className="flex items-center justify-between gap-3 rounded-lg border p-3"
                  >
                    <div>
                      <div className="font-medium">{row.label}</div>
                      <div className="text-xs text-muted-foreground">Evidence ID: {row.id}</div>
                    </div>
                    <Badge variant={row.state === 'PENDING' ? 'secondary' : 'outline'}>
                      {row.state}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Related capabilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {['Frontend Development', 'Software Craft', 'API Integration'].map((name) => (
              <div key={name} className="rounded-lg border p-3">
                <div className="font-medium">{name}</div>
                <div className="text-xs text-muted-foreground">Edge weight: —</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
