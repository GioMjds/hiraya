export default async function Page({
  params,
}: PageProps<'/onboarding/[userID]'>) {
  const { userID } = await params;

  return <div></div>;
}
