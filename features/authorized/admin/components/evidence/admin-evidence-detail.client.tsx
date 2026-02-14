'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import {
  useApproveAdminEvidenceReview,
  useGetAdminEvidenceReviewById,
  useRejectAdminEvidenceReview,
} from '@/features/authorized/admin/hooks';

interface AdminEvidenceDetailClientProps {
  reviewId: string;
}

export function AdminEvidenceDetailClient({ reviewId }: AdminEvidenceDetailClientProps) {
  const [reason, setReason] = useState<string>('');
  const { data: review, isLoading } = useGetAdminEvidenceReviewById(reviewId);
  const { mutateAsync: approveReview, isPending: isApproving } = useApproveAdminEvidenceReview();
  const { mutateAsync: rejectReview, isPending: isRejecting } = useRejectAdminEvidenceReview();

  const handleReject = async () => {
    if (!reason.trim()) return;
    await rejectReview({ id: reviewId, reason: reason.trim() });
    setReason('');
  };

  const isDecisionPending = isApproving || isRejecting;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Evidence Detail</h1>
          <p className="text-sm text-muted-foreground">
            Inspect the artifact and verify its linked skills.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/evidence">Back to evidence</Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="space-y-1">
                  <CardTitle className="text-base">Review context</CardTitle>
                  <div className="text-sm text-muted-foreground">Evidence submission</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={review?.status === 'PENDING' ? 'secondary' : 'outline'}>
                    {review?.status ?? 'PENDING'}
                  </Badge>
                  <Badge variant="outline">{review?.entityType ?? 'evidence'}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border p-4">
                <div className="text-sm font-medium">Action</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {isLoading ? 'Loading review details...' : review?.action ?? 'verify'}
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="text-sm font-medium">Reason</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {review?.reason ?? 'No rejection reason submitted.'}
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <div className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Verification guardrails
                </div>
                <div className="text-sm text-muted-foreground">
                  Verify artifact relevance, accessibility, and consistency with declared claims.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border p-3 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Decision state</div>
                <Badge variant={review?.status === 'PENDING' ? 'secondary' : 'outline'}>
                  {review?.status ?? 'PENDING'}
                </Badge>
              </div>
              <div className="grid gap-2">
                <Button disabled={isDecisionPending} onClick={async () => await approveReview(reviewId)}>
                  Approve
                </Button>
                <Input
                  placeholder="Rejection reason"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  disabled={isDecisionPending}
                />
                <Button
                  variant="destructive"
                  disabled={!reason.trim() || isDecisionPending}
                  onClick={handleReject}
                >
                  Reject
                </Button>
              </div>
              <Separator />
              <div className="rounded-lg border p-3 text-sm text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Keep governance decisions consistent for similar evidence types.
              </div>
              <div className="rounded-lg border p-3 text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Evidence review should remain explainable and reproducible.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-sm text-muted-foreground">Review ID</div>
              <div className="font-mono text-sm">{reviewId}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
