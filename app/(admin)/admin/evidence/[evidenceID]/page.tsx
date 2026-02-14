import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { ApiError } from '@/configs/fetch';
import { admin } from '@/lib/api/authorized/admin';
import {
  adminEvidenceQueryKeys,
  AdminEvidenceDetailClient,
} from '@/features/authorized/admin';

export async function generateMetadata({
  params,
}: PageProps<'/admin/evidence/[evidenceID]'>): Promise<Metadata> {
  const { evidenceID } = await params;
  const evidence = await admin.getEvidenceReviewById(evidenceID);

  if (!evidence) {
    return {
      title: 'Evidence Not Found',
      description: 'The requested evidence review could not be found.',
    };
  }

  return {
    title: `Evidence Review # ${evidence.id}`,
    description: `Review evidence.`,
  };
}

export default async function Page({
  params,
}: PageProps<'/admin/evidence/[evidenceID]'>) {
  const { evidenceID } = await params;
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: adminEvidenceQueryKeys.detail(evidenceID),
      queryFn: async () => await admin.getEvidenceReviewById(evidenceID),
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminEvidenceDetailClient reviewId={evidenceID} />
    </HydrationBoundary>
  );
}
