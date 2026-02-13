import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { user } from '@/lib/api/authorized/user';
import { userMatchQueryKeys } from '@/features/authorized/user/hooks';
import { UserMatchesClient } from '@/features/authorized/user/components';

export default async function Page({ params }: PageProps<'/user/[userID]/matches'>) {
  const { userID } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: userMatchQueryKeys.list(),
    queryFn: async () => await user.getUserMatches(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserMatchesClient userId={userID} />
    </HydrationBoundary>
  );
}
