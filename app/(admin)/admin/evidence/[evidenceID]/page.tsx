export default async function Page({
  params,
}: PageProps<'/admin/evidence/[evidenceID]'>) {
  const { evidenceID } = await params;

  return (
    <div className="text-black dark:text-white text-3xl">
      Evidence ID: {evidenceID}
    </div>
  );
}
