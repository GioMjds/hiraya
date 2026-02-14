import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { admin } from '@/lib/api/authorized/admin';
import {
  adminDashboardQueryKeys,
  adminEvidenceQueryKeys,
  AdminDashboardClient,
} from '@/features/authorized/admin';

export default async function Page() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: adminDashboardQueryKeys.detail(),
      queryFn: async () => await admin.getDashboard(),
    }),
    queryClient.prefetchQuery({
      queryKey: adminEvidenceQueryKeys.queue(),
      queryFn: async () => await admin.getEvidenceReviewQueue(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminDashboardClient />
    </HydrationBoundary>
  );
}
