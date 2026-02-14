import type { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { EmployerPostingDetailClient } from '@/features/authorized/employer/components';
import { employerPostingsQueryKeys } from '@/features/authorized/employer/hooks';
import { employer } from '@/lib/api/authorized/employer';

export async function generateMetadata({
  params,
}: PageProps<'/employer/[employerID]/postings/[postingID]'>): Promise<Metadata> {
  const { postingID } = await params;
  const post = await employer.getRolePostingById(postingID);

  if (!post) {
    return {
      title: 'Posting Not Found',
      description: 'The specified job posting could not be found.',
    };
  }
  
  return {
    title: `Details for ${post.employmentType} Posting`,
    description: post.description,
  };
}

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
