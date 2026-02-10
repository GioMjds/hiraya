import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VerifyForm } from '@/features/identity';
import Skeleton from 'react-loading-skeleton';

export const metadata: Metadata = {
  title: 'Verify Email',
  description: 'Verify your email address to activate your Hiraya account.',
};

function VerifyFormFallback() {
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <Skeleton height={32} width={200} />
      <Skeleton height={16} width={280} />
      <div className="flex justify-center gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height={40} width={40} />
        ))}
      </div>
      <Skeleton height={40} />
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyFormFallback />}>
      <VerifyForm />
    </Suspense>
  );
}
