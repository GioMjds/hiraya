export default async function Page({
  params,
}: PageProps<'/employer/[employerID]/roles/[roleID]'>) {
  const { roleID } = await params;

  return <div></div>;
}
