'use client';

import type { Route } from 'next';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api/identity/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Status = 'idle' | 'error';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            config: {
              theme?: string;
              size?: string;
              width?: number;
              type?: string;
              shape?: string;
              text?: string;
              logo_alignment?: string;
            },
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleOAuthButton() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleGoogleCallback = useCallback(
    async (response: { credential: string }) => {
      setStatus('idle');
      setErrorMessage('');

      const idToken = response.credential;
      if (!idToken) {
        setStatus('error');
        setErrorMessage('Google sign-in failed.');
        return;
      }

      try {
        const result = await auth.googleOAuth({ idToken });
        const user = result.user;

        if (!user.isEmailVerified) {
          router.push(`/verify?email=${encodeURIComponent(user.email)}`);
          return;
        }

        if (!user.isSurveyDone) {
          router.push(`/onboarding/${user.id}`);
          return;
        }

        if (user.role === 'ADMIN') {
          router.push('/admin');
          return;
        }

        if (user.role === 'EMPLOYER') {
          router.push(`/employer/${user.id}` as Route);
          return;
        }

        router.push(`/user/${user.id}` as Route);
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : 'Google sign-in failed.';
        setStatus('error');
        setErrorMessage(message);
      }
    },
    [router],
  );

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleLoaded(true);
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]',
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  useEffect(() => {
    if (!googleLoaded || !window.google || !googleButtonRef.current) {
      return;
    }

    googleButtonRef.current.innerHTML = '';

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID!,
      callback: handleGoogleCallback,
    });

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: 'outline',
      size: 'large',
      width: 400,
      type: 'standard',
      shape: 'rectangular',
      text: 'signin_with',
      logo_alignment: 'left',
    });
  }, [googleLoaded, handleGoogleCallback]);

  return (
    <div className="space-y-3">
      {status === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div ref={googleButtonRef} className="flex justify-center" />
    </div>
  );
}
