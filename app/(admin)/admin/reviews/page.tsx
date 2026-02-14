import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { admin } from '@/lib/api/authorized/admin';
import { adminEvidenceQueryKeys, AdminReviewsClient } from '@/features/authorized/admin';

export const metadata: Metadata = {
  title: 'Review Evidence Submissions',
  description: 'Review and manage evidence submissions from users.',
};

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: adminEvidenceQueryKeys.queue(),
    queryFn: async () => await admin.getEvidenceReviewQueue(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminReviewsClient />
    </HydrationBoundary>
  );
}
