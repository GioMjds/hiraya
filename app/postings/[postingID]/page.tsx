export default async function Page({ params }: PageProps<'/postings/[postingID]'>) {
  const { postingID } = await params;

  return <div></div>;
}
