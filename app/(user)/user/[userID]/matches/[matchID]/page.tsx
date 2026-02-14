import type { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { user } from '@/lib/api/authorized/user';
import { userMatchQueryKeys } from '@/features/authorized/user/hooks';
import { UserMatchDetailClient } from '@/features/authorized/user/components';

export async function generateMetadata({
  params,
}: PageProps<'/user/[userID]/matches/[matchID]'>): Promise<Metadata> {
  const { matchID } = await params;
  const match = await user.getUserMatchById(matchID);

  if (!match) {
    return {
      title: 'Match Not Found',
      description: 'The specified match could not be found.',
    };
  }

  return {
    title: `Details for ${match.role?.title}`,
    description: `Detailed information about the match ${match.role?.title}.`,
  };
}

export default async function Page({
  params,
}: PageProps<'/user/[userID]/matches/[matchID]'>) {
  const { userID, matchID } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: userMatchQueryKeys.detail(matchID),
    queryFn: async () => await user.getUserMatchById(matchID),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserMatchDetailClient userId={userID} matchId={matchID} />
    </HydrationBoundary>
  );
}
