import { OnboardingPage } from '@/features/identity/auth/components/onboarding';

export default async function Page({
  params,
}: PageProps<'/onboarding/[userID]'>) {
  const { userID } = await params;

  return <OnboardingPage userId={userID} />;
}
