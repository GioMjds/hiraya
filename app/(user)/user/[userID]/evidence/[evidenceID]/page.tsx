export default async function Page({ params }: PageProps<'/user/[userID]/evidence/[evidenceID]'>) {
  const { evidenceID } = await params;

  return <div></div>;
}
