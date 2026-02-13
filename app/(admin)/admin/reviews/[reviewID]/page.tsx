import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Check, X } from 'lucide-react';

const reviewItems: Array<{ label: string; value: string }> = [];

export default async function Page({ params }: PageProps<'/admin/reviews/[reviewID]'>) {
  const { reviewID } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin">Admin</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin/reviews">Reviews</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{reviewID}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Review</h1>
            <p className="text-sm text-muted-foreground">
              Make a decision for a review request.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/reviews">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button variant="outline">
              <X className="mr-1 h-4 w-4" />
              Reject
            </Button>
            <Button>
              <Check className="mr-1 h-4 w-4" />
              Approve
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Evidence Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="font-medium">Submission</div>
                  <div className="text-sm text-muted-foreground">
                    A submitted artifact linked to one or more skill claims.
                  </div>
                </div>
                <Badge variant="secondary">PENDING</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Checklist</div>
              <div className="grid gap-2">
                {[
                  'Artifact is accessible and relevant',
                  'Claimed skills match the artifact contents',
                  'No duplicates or low-quality submissions',
                ].map((text) => (
                  <div key={text} className="flex items-start gap-2 rounded-lg border p-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <div className="text-sm text-muted-foreground">{text}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reviewItems.length === 0 ? (
              <div className="text-sm text-muted-foreground">No review metadata available yet.</div>
            ) : (
              reviewItems.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3">
                  <div className="text-sm text-muted-foreground">{row.label}</div>
                  <div className="text-sm font-medium text-right">{row.value}</div>
                </div>
              ))
            )}
            <Separator />
            <div className="text-xs text-muted-foreground">Review ID: {reviewID}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
