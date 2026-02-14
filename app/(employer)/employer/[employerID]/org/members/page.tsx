import type { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { EmployerMembersClient } from '@/features/authorized/employer/components';
import { employerOrganizationQueryKeys } from '@/features/authorized/employer/hooks';
import { employer } from '@/lib/api/authorized/employer';

export const metadata: Metadata = {
  title: 'Organization Members',
  description:
    'Manage your organization members, including adding new members, assigning roles, and overseeing team collaboration within your company.',
};

export default async function Page({
  params,
}: PageProps<'/employer/[employerID]/org/members'>) {
  const { employerID } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: employerOrganizationQueryKeys.members(),
    queryFn: async () => await employer.getOrganizationMembers(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EmployerMembersClient employerId={employerID} />
    </HydrationBoundary>
  );
}
