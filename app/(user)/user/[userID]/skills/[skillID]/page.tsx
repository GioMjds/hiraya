export default async function Page({
  params,
}: PageProps<'/user/[userID]/skills/[skillID]'>) {
  const { skillID } = await params;

  return <div></div>;
}
