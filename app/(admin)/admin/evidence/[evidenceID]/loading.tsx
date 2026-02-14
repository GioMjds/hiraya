import Skeleton from 'react-loading-skeleton';

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton height={30} width={240} />
      <Skeleton height={16} width="80%" />
      <Skeleton height={180} />
      <Skeleton height={180} />
    </div>
  );
}
