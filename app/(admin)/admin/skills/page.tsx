import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { admin } from '@/lib/api/authorized/admin';
import { adminSkillQueryKeys, AdminSkillsClient } from '@/features/authorized/admin';

export const metadata: Metadata = {
  title: 'Manage Skills',
  description: 'Create, update, and archive skills for the platform.',
};

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: adminSkillQueryKeys.list(),
    queryFn: async () => await admin.getSkills(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminSkillsClient />
    </HydrationBoundary>
  );
}
