import type { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { user } from '@/lib/api/authorized/user';
import { userEvidenceQueryKeys } from '@/features/authorized/user/hooks';
import { UserEvidenceClient } from '@/features/authorized/user/components';

export const metadata: Metadata = {
  title: 'Your Evidence - Hiraya',
  description:
    "View and manage your evidence submissions on Hiraya's user dashboard.",
};

export default async function Page({
  params,
}: PageProps<'/user/[userID]/evidence'>) {
  const { userID } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: userEvidenceQueryKeys.list(),
    queryFn: async () => await user.getUserEvidence(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserEvidenceClient userId={userID} />
    </HydrationBoundary>
  );
}
