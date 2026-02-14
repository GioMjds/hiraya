'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { AdminWorkspaceHero } from '../shared/admin-workspace-hero';

interface AdminReviewDetailClientProps {
  reviewId: string;
}

export function AdminReviewDetailClient({ reviewId }: AdminReviewDetailClientProps) {
  const [reason, setReason] = useState<string>('');
  const [isApproveOpen, setIsApproveOpen] = useState<boolean>(false);
  const [isRejectOpen, setIsRejectOpen] = useState<boolean>(false);
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

        <AdminWorkspaceHero
          title="Review"
          description="Make clear and consistent governance decisions for queued evidence reviews."
          actions={
            <>
              <Button variant="outline" asChild>
                <Link href="/admin/reviews">
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back
                </Link>
              </Button>
              <Button
                variant="outline"
                disabled={isPending}
                onClick={() => setIsRejectOpen(true)}
              >
                <X className="mr-1 h-4 w-4" />
                Reject
              </Button>
              <Button
                disabled={isPending}
                onClick={() => setIsApproveOpen(true)}
              >
                <Check className="mr-1 h-4 w-4" />
                Approve
              </Button>
            </>
          }
          badges={[
            { label: 'Review ID', value: reviewId },
            {
              label: 'Status',
              value: review?.status ?? 'PENDING',
              variant: 'outline',
            },
          ]}
        />
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

      <AlertDialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve this review?</AlertDialogTitle>
            <AlertDialogDescription>
              Confirm approval for this queued review item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              type="button"
              disabled={isPending}
              onClick={async () => {
                await approveReview(reviewId);
                setIsApproveOpen(false);
              }}
            >
              Approve
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this review?</AlertDialogTitle>
            <AlertDialogDescription>
              Provide a reason before rejecting this queued review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="Rejection reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              disabled={isPending}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending || !reason.trim()}
              onClick={async () => {
                await rejectReview({ id: reviewId, reason: reason.trim() });
                setIsRejectOpen(false);
                setReason('');
              }}
            >
              Reject review
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
