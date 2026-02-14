import type { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { user } from '@/lib/api/authorized/user';
import { match } from '@/lib/api/match';
import { userMatchQueryKeys } from '@/features/authorized/user/hooks';
import { UserMatchesClient } from '@/features/authorized/user/components';

export const metadata: Metadata = {
  title: 'Your Matches - Hiraya',
  description: "View and manage your matches on Hiraya's user dashboard.",
};

export default async function Page({
  params,
}: PageProps<'/user/[userID]/matches'>) {
  const { userID } = await params;
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: userMatchQueryKeys.list(),
      queryFn: async () => await user.getUserMatches(),
    }),
    queryClient.prefetchQuery({
      queryKey: userMatchQueryKeys.health(),
      queryFn: async () => await match.getHealth(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserMatchesClient userId={userID} />
    </HydrationBoundary>
  );
}
