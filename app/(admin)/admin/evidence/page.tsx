import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { admin } from '@/lib/api/authorized/admin';
import { adminEvidenceQueryKeys, AdminEvidenceClient } from '@/features/authorized/admin';

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: adminEvidenceQueryKeys.queue(),
    queryFn: async () => await admin.getEvidenceReviewQueue(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminEvidenceClient />
    </HydrationBoundary>
  );
}
