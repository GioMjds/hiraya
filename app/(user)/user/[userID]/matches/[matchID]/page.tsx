import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { user } from '@/lib/api/authorized/user';
import { userMatchQueryKeys } from '@/features/authorized/user/hooks';
import { UserMatchDetailClient } from '@/features/authorized/user/components';

export default async function Page({ params }: PageProps<'/user/[userID]/matches/[matchID]'>) {
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
