'use client';

import type { Route } from 'next';
import { useState, useCallback } from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api/identity/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Status = 'idle' | 'error';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleOAuthButton() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleGoogleCallback = useCallback(
    async (response: CredentialResponse) => {
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
          router.push(`/employer/${user.id}/dashboard` as Route);
          return;
        }

        router.push(`/user/${user.id}/dashboard` as Route);
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : 'Google sign-in failed.';
        setStatus('error');
        setErrorMessage(message);
      }
    },
    [router],
  );

  return (
    <div className="space-y-3">
      {!GOOGLE_CLIENT_ID && (
        <Alert variant="destructive">
          <AlertDescription>
            Google sign-in is not configured.
          </AlertDescription>
        </Alert>
      )}

      {status === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {GOOGLE_CLIENT_ID && (
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleCallback}
            onError={() => {
              setStatus('error');
              setErrorMessage('Google sign-in failed.');
            }}
            theme="outline"
            size="large"
            width="400"
            type="standard"
            shape="rectangular"
            text="signin_with"
            logo_alignment="left"
          />
        </div>
      )}
    </div>
  );
}
