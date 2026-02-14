import type { Metadata } from 'next';
import { EmployerNewPostingClient } from '@/features/authorized/employer/components';

export const metadata: Metadata = {
  title: 'Create New Job Posting',
  description:
    'Create a new job posting for your organization with our Employer New Posting feature.',
};

export default async function Page({
  params,
}: PageProps<'/employer/[employerID]/postings/new'>) {
  const { employerID } = await params;
  return <EmployerNewPostingClient employerId={employerID} />;
}
