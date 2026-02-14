import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { user } from '@/lib/api/authorized/user';
import { userSkillQueryKeys } from '@/features/authorized/user/hooks';
import { UserSkillsClient } from '@/features/authorized/user/components';

export default async function Page({
  params,
}: PageProps<'/user/[userID]/skills'>) {
  const { userID } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: userSkillQueryKeys.list(),
    queryFn: async () => await user.getUserSkills(),
  });

  await queryClient.prefetchQuery({
    queryKey: userSkillQueryKeys.options(),
    queryFn: async () => await user.getUserSkillOptions(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserSkillsClient userId={userID} />
    </HydrationBoundary>
  );
}
