import Skeleton from 'react-loading-skeleton';

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton height={30} width={180} />
      <Skeleton height={16} width="50%" />
      <Skeleton height={320} />
    </div>
  );
}
