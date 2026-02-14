import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { EmployerOrganizationClient } from '@/features/authorized/employer/components';
import { employerOrganizationQueryKeys } from '@/features/authorized/employer/hooks';
import { employer } from '@/lib/api/authorized/employer';

export default async function Page({ params }: PageProps<'/employer/[employerID]/org'>) {
  const { employerID } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: employerOrganizationQueryKeys.detail(),
    queryFn: async () => await employer.getOrganization(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EmployerOrganizationClient employerId={employerID} />
    </HydrationBoundary>
  );
}
