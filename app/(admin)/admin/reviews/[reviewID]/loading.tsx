import Skeleton from 'react-loading-skeleton';

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton height={24} width={220} />
      <Skeleton height={16} width="60%" />
      <Skeleton height={180} />
      <Skeleton height={180} />
    </div>
  );
}
