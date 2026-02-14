import type { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { admin } from '@/lib/api/authorized/admin';
import {
  adminAuditQueryKeys,
  AdminAuditClient,
} from '@/features/authorized/admin';

export const metadata: Metadata = {
  title: 'Audit Logs',
  description: 'View and monitor audit logs for your application.',
}

export default async function Page() {
  const queryClient = new QueryClient();
  const page = 1;
  const limit = 20;

  await queryClient.prefetchQuery({
    queryKey: adminAuditQueryKeys.list(page, limit),
    queryFn: async () => await admin.auditLogs({ page, limit }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminAuditClient />
    </HydrationBoundary>
  );
}
