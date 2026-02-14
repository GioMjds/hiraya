import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { user } from '@/lib/api/authorized/user';
import { userSkillQueryKeys } from '@/features/authorized/user/hooks';
import { UserSkillDetailClient } from '@/features/authorized/user/components';

export async function generateMetadata({
  params
}: PageProps<'/user/[userID]/skills/[skillID]'>): Promise<Metadata> {
  const { skillID } = await params;
  const skill = await user.getUserSkills();
  if (!skill) {
    return {
      title: 'Skill Not Found',
      description: 'The requested skill could not be found.',
    };
  }

  return {
    title: `Details for ${skill.find(s => s.id === skillID)?.skill?.name || 'Skill'}`,
    description: `Detailed information about the skill ${skill.find(s => s.id === skillID)?.skill?.name || 'Skill'}.`,
  }
}

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
