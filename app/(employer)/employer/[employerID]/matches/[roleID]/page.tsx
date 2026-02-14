import type { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { employer } from '@/lib/api/authorized/employer';
import { EmployerRoleMatchesClient, employerRolesQueryKeys } from '@/features/authorized/employer';

export async function generateMetadata({
  params
}: PageProps<'/employer/[employerID]/matches/[roleID]'>): Promise<Metadata> {
  const { roleID } = await params;
  const role = await employer.getRoleById(roleID);
  
  if (!role) {
    return {
      title: 'Role Not Found',
      description: 'The specified role could not be found.',
    };
  }

  return {
    title: `Matches for ${role.role.title} Role`,
    description: `Matches for the role "${role.role.title}"`,
  };
}

export default async function Page({
  params,
}: PageProps<'/employer/[employerID]/matches/[roleID]'>) {
  const { employerID, roleID } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: employerRolesQueryKeys.detail(roleID),
    queryFn: async () => await employer.getRoleById(roleID),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EmployerRoleMatchesClient employerId={employerID} roleId={roleID} />
    </HydrationBoundary>
  );
}
