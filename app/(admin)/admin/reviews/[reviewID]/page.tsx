import { notFound } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/configs/fetch';
import { admin } from '@/lib/api/authorized/admin';
import { adminEvidenceQueryKeys, AdminReviewDetailClient } from '@/features/authorized/admin';

export default async function Page({ params }: PageProps<'/admin/reviews/[reviewID]'>) {
  const { reviewID } = await params;
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: adminEvidenceQueryKeys.detail(reviewID),
      queryFn: async () => await admin.getEvidenceReviewById(reviewID),
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminReviewDetailClient reviewId={reviewID} />
    </HydrationBoundary>
  );
}
