import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { admin } from '@/lib/api/authorized/admin';
import {
  adminCapabilityQueryKeys,
  AdminCapabilitiesClient,
} from '@/features/authorized/admin';

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: adminCapabilityQueryKeys.list(),
    queryFn: async () => await admin.getCapabilities(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminCapabilitiesClient />
    </HydrationBoundary>
  );
}
