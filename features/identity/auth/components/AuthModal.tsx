'use client';

import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface AuthModalProps {
  title: string;
  children: ReactNode;
}

export function AuthModal({ title, children }: AuthModalProps) {
  const router = useRouter();

  useEffect(() => {
    // Handle ESC key manually since we aren't using native <dialog>
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.back();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent scrolling on the body while modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [router]);

  const handleClose = () => {
    router.back();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-foreground rounded-lg shadow-xl w-full max-w-md relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          type="button"
          className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none transition z-10"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-background">{title}</h2>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
