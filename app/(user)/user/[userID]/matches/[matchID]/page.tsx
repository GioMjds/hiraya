export default async function Page({ params }: PageProps<'/user/[userID]/matches/[matchID]'>) {
  const { matchID } = await params;

  return <div></div>;
}
