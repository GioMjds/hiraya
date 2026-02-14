import type { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { user } from '@/lib/api/authorized/user';
import { userEvidenceQueryKeys } from '@/features/authorized/user/hooks';
import { UserEvidenceDetailClient } from '@/features/authorized/user/components';

export async function generateMetadata({
  params,
}: PageProps<'/user/[userID]/evidence/[evidenceID]'>): Promise<Metadata> {
  const { evidenceID } = await params;
  const evidence = await user.getUserEvidenceDetail(evidenceID);

  if (!evidence) {
    return {
      title: 'Evidence Not Found',
      description: 'The specified evidence could not be found.',
    };
  }

  return {
    title: `Details for ${evidence.title}`,
    description: `Detailed information about the evidence submission ${evidence.title}.`,
  };
}

export default async function Page({
  params,
}: PageProps<'/user/[userID]/evidence/[evidenceID]'>) {
  const { userID, evidenceID } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: userEvidenceQueryKeys.detail(evidenceID),
    queryFn: async () => await user.getUserEvidenceDetail(evidenceID),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserEvidenceDetailClient userId={userID} evidenceId={evidenceID} />
    </HydrationBoundary>
  );
}
