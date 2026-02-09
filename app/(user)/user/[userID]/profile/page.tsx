export default async function Page({ params }: PageProps<'/user/[userID]/profile'>) {
  const { userID } = await params;

  return <div></div>;
}
