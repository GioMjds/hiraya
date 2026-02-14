'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetEmployerPostingById } from '@/features/authorized/employer/hooks';
import { CheckCircle2, Target } from 'lucide-react';
import { EmployerWorkspaceHero } from '../shared/employer-workspace-hero';

interface EmployerPostingDetailClientProps {
  employerId: string;
  postingId: string;
}

export function EmployerPostingDetailClient({
  employerId,
  postingId,
}: EmployerPostingDetailClientProps) {
  const { data: posting } = useGetEmployerPostingById(postingId);

  return (
    <div className="space-y-6">
      <EmployerWorkspaceHero
        title="Posting detail"
        description="Track posting health and keep candidate pipeline context easy to review."
        actions={
          <Button variant="outline" asChild>
            <Link href={`/employer/${employerId}/postings`}>Back to postings</Link>
          </Button>
        }
        badges={[
          { label: 'Posting ID', value: postingId },
          {
            label: 'Status',
            value: posting?.status?.toUpperCase() ?? 'DRAFT',
            variant: 'outline',
          },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Posting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-sm text-muted-foreground">Title</div>
                  <div className="text-lg font-semibold">
                    {posting?.role?.title ?? posting?.roleId ?? 'Loading posting...'}
                  </div>
                </div>
                <Badge variant="outline">{posting?.status?.toUpperCase() ?? 'DRAFT'}</Badge>
              </div>
              <Separator className="my-4" />
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>Location: {posting?.location ?? 'Not specified'}</div>
                <div>
                  Employment type: {posting?.employmentType ?? 'Not specified'}
                </div>
                <div>
                  Salary:{' '}
                  {posting && (posting.salaryMin !== null || posting.salaryMax !== null)
                    ? `${posting.currency ?? ''} ${posting.salaryMin ?? '—'} - ${posting.salaryMax ?? '—'}`
                    : 'Not specified'}
                </div>
                <div>{posting?.description || 'No posting description provided.'}</div>
              </div>
            </div>
            <div className="rounded-lg border p-4 space-y-2">
              <div className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Candidate pipeline
              </div>
              <div className="text-sm text-muted-foreground">
                Candidate pipeline is not available yet.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full">Edit</Button>
            <Button variant="outline" className="w-full">Close posting</Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/employer/${employerId}/matches`}>Open matches</Link>
            </Button>
            <Separator />
            <div className="rounded-lg border p-3 text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Keep role requirements aligned with this posting before publication.
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Posting ID</div>
              <div className="font-mono text-sm">{postingId}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
