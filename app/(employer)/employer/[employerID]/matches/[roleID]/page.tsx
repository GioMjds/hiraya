import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { employer } from '@/lib/api/authorized/employer';
import { EmployerRoleMatchesClient, employerRolesQueryKeys } from '@/features/authorized/employer';

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
