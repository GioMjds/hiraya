import type { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { EmployerRolesClient } from '@/features/authorized/employer/components';
import { employerRolesQueryKeys } from '@/features/authorized/employer/hooks';
import { employer } from '@/lib/api/authorized/employer';

export const metadata: Metadata = {
  title: 'Manage Roles',
  description:
    'Manage roles for your organization with our Employer Roles feature.',
};

export default async function Page({
  params,
}: PageProps<'/employer/[employerID]/roles'>) {
  const { employerID } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: employerRolesQueryKeys.list(),
    queryFn: async () => await employer.getRoles(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EmployerRolesClient employerId={employerID} />
    </HydrationBoundary>
  );
}
