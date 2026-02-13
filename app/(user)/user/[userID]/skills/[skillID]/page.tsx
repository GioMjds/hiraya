import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { user } from '@/lib/api/authorized/user';
import { userSkillQueryKeys } from '@/features/authorized/user/hooks';
import { UserSkillDetailClient } from '@/features/authorized/user/components';

export default async function Page({
  params,
}: PageProps<'/user/[userID]/skills/[skillID]'>) {
  const { userID, skillID } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: userSkillQueryKeys.list(),
    queryFn: async () => await user.getUserSkills(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserSkillDetailClient userId={userID} skillId={skillID} />
    </HydrationBoundary>
  );
}
