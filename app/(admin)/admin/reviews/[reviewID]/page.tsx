export default async function Page({ params }: PageProps<'/admin/reviews/[reviewID]'>) {
  const { reviewID } = await params;
  
  return <div></div>;
}
