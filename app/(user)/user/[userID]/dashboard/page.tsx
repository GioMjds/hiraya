import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { user } from '@/lib/api/authorized/user';
import { userProfileQueryKeys } from '@/features/authorized/user/hooks';
import { UserDashboardClient } from '@/features/authorized/user/components';

export default async function Page({
  params,
}: PageProps<'/user/[userID]/dashboard'>) {
  const { userID } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: userProfileQueryKeys.dashboard(),
    queryFn: async () => await user.getDashboard(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserDashboardClient userId={userID} />
    </HydrationBoundary>
  );
}
