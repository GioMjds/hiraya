export default async function Page({
  params,
}: PageProps<'/employer/[employerID]/postings/[postingID]'>) {
  const { postingID } = await params;

  return <div></div>;
}
