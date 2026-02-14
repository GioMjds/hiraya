import Skeleton from 'react-loading-skeleton';

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton height={32} width={220} />
      <Skeleton height={16} width="70%" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} height={140} />
        ))}
      </div>
    </div>
  );
}
