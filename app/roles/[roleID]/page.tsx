export default async function Page({ params }: PageProps<'/roles/[roleID]'>) {
  const { roleID } = await params;

  return <div></div>;
}
