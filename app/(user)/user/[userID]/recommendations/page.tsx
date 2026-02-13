import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { user } from '@/lib/api/authorized/user';
import { userMatchQueryKeys } from '@/features/authorized/user/hooks';
import { UserRecommendationsClient } from '@/features/authorized/user/components';

export default async function Page({
  params,
}: PageProps<'/user/[userID]/recommendations'>) {
  const { userID } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: userMatchQueryKeys.recommendations(),
    queryFn: async () => await user.getUserRecommendations(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserRecommendationsClient userId={userID} />
    </HydrationBoundary>
  );
}
