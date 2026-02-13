import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { user } from '@/lib/api/authorized/user';
import { userProfileQueryKeys } from '@/features/authorized/user/hooks';
import { UserProfileClient } from '@/features/authorized/user/components';

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: userProfileQueryKeys.profile(),
    queryFn: async () => await user.getProfile(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserProfileClient />
    </HydrationBoundary>
  );
}
