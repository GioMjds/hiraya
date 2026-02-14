import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { employer } from '@/lib/api/authorized/employer';
import { employerDashboardQueryKeys } from '@/features/authorized/employer/hooks';
import { EmployerDashboardClient } from '@/features/authorized/employer/components';

export default async function Page({
  params,
}: PageProps<'/employer/[employerID]/dashboard'>) {
  const { employerID } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: employerDashboardQueryKeys.detail(),
    queryFn: async () => await employer.getDashboard(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EmployerDashboardClient employerId={employerID} />
    </HydrationBoundary>
  );
}
