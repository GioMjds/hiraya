import type { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { EmployerRoleDetailClient } from '@/features/authorized/employer/components';
import { employerRolesQueryKeys } from '@/features/authorized/employer/hooks';
import { employer } from '@/lib/api/authorized/employer';

export async function generateMetadata({
  params,
}: PageProps<'/employer/[employerID]/roles/[roleID]'>): Promise<Metadata> {
  const { roleID } = await params;
  const role = await employer.getRoleById(roleID);

  if (!role) {
    return {
      title: 'Role Not Found',
      description: 'The specified role could not be found.',
    };
  }

  return {
    title: `Details for ${role.role.title} Role`,
    description: `Detailed information about the role ${role.role.title}, including responsibilities, requirements, and associated job postings.`,
  };
}

export default async function Page({
  params,
}: PageProps<'/employer/[employerID]/roles/[roleID]'>) {
  const { employerID, roleID } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: employerRolesQueryKeys.detail(roleID),
    queryFn: async () => await employer.getRoleById(roleID),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EmployerRoleDetailClient employerId={employerID} roleId={roleID} />
    </HydrationBoundary>
  );
}
