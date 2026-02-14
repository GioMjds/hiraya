import { notFound } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/configs/fetch';
import { admin } from '@/lib/api/authorized/admin';
import {
  adminEvidenceQueryKeys,
  AdminEvidenceDetailClient,
} from '@/features/authorized/admin';

export default async function Page({
  params,
}: PageProps<'/admin/evidence/[evidenceID]'>) {
  const { evidenceID } = await params;
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: adminEvidenceQueryKeys.detail(evidenceID),
      queryFn: async () => await admin.getEvidenceReviewById(evidenceID),
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminEvidenceDetailClient reviewId={evidenceID} />
    </HydrationBoundary>
  );
}
