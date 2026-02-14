import type { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { EmployerPostingsClient } from '@/features/authorized/employer/components';
import { employerPostingsQueryKeys } from '@/features/authorized/employer/hooks';
import { employer } from '@/lib/api/authorized/employer';

export const metadata: Metadata = {
  title: 'Job Postings',
  description:
    'Create and manage your job postings with our Employer Postings feature, designed to help you attract top talent to your organization.',
};

export default async function Page({
  params,
}: PageProps<'/employer/[employerID]/postings'>) {
  const { employerID } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: employerPostingsQueryKeys.list(),
    queryFn: async () => await employer.getRolePostings(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EmployerPostingsClient employerId={employerID} />
    </HydrationBoundary>
  );
}
