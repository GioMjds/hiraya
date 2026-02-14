import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { EmployerPostingDetailClient } from '@/features/authorized/employer/components';
import { employerPostingsQueryKeys } from '@/features/authorized/employer/hooks';
import { employer } from '@/lib/api/authorized/employer';

export default async function Page({
  params,
}: PageProps<'/employer/[employerID]/postings/[postingID]'>) {
  const { employerID, postingID } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: employerPostingsQueryKeys.detail(postingID),
    queryFn: async () => await employer.getRolePostingById(postingID),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EmployerPostingDetailClient employerId={employerID} postingId={postingID} />
    </HydrationBoundary>
  );
}
