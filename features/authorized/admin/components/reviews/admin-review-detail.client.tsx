'use client';

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Check, ShieldCheck, X } from 'lucide-react';
import {
  useApproveAdminEvidenceReview,
  useGetAdminEvidenceReviewById,
  useRejectAdminEvidenceReview,
} from '@/features/authorized/admin/hooks';

interface AdminReviewDetailClientProps {
  reviewId: string;
}

export function AdminReviewDetailClient({ reviewId }: AdminReviewDetailClientProps) {
  const [reason, setReason] = useState<string>('');
  const { data: review, isLoading } = useGetAdminEvidenceReviewById(reviewId);
  const { mutateAsync: approveReview, isPending: isApproving } = useApproveAdminEvidenceReview();
  const { mutateAsync: rejectReview, isPending: isRejecting } = useRejectAdminEvidenceReview();

  const isPending = isApproving || isRejecting;

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
              <BreadcrumbPage>{reviewId}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Review</h1>
            <p className="text-sm text-muted-foreground">Make a decision for a review request.</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/reviews">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button
              variant="outline"
              disabled={!reason.trim() || isPending}
              onClick={async () => await rejectReview({ id: reviewId, reason: reason.trim() })}
            >
              <X className="mr-1 h-4 w-4" />
              Reject
            </Button>
            <Button disabled={isPending} onClick={async () => await approveReview(reviewId)}>
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
                    {isLoading ? 'Loading review...' : `Action: ${review?.action ?? 'verify'}`}
                  </div>
                </div>
                <Badge variant={review?.status === 'PENDING' ? 'secondary' : 'outline'}>
                  {review?.status ?? 'PENDING'}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Rejection reason</div>
              <Input
                placeholder="Enter rejection reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                disabled={isPending}
              />
            </div>

            <div className="rounded-lg border p-4 text-sm text-muted-foreground">
              Current reason: {review?.reason ?? 'No rejection reason provided.'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Review controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border p-3 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Current status</div>
              <Badge variant={review?.status === 'PENDING' ? 'secondary' : 'outline'}>
                {review?.status ?? 'PENDING'}
              </Badge>
            </div>
            <div className="rounded-lg border p-3 text-sm text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Governance review is required before final decision.
            </div>
            <Separator />
            <div className="text-xs text-muted-foreground">Review ID: {reviewId}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
