import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { EmployerRoleDetailClient } from '@/features/authorized/employer/components';
import { employerRolesQueryKeys } from '@/features/authorized/employer/hooks';
import { employer } from '@/lib/api/authorized/employer';

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
