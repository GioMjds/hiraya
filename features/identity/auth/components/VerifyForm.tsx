'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { auth, VerifyEmailData } from '@/repositories/identity/auth';
import { ApiError } from '@/configs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState<string>('');
  const [verifyError, setVerifyError] = useState<string>('');
  const [resendMessage, setResendMessage] = useState<string>('');
  const [isResending, setIsResending] = useState(false);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<VerifyEmailData>({
    defaultValues: {
      email,
      otp: '',
    },
  });

  const onVerify = async () => {
    try {
      setVerifyError('');
      await auth.verifyEmail({ email, otp });
      router.push('/[lang]');
    } catch (error) {
      if (error instanceof ApiError) {
        setVerifyError(error.message);
      } else {
        setVerifyError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      setResendMessage('');
      setVerifyError('');

      await auth.resendVerification({ email });
      setResendMessage('A new verification code has been sent to your email.');
    } catch (error) {
      if (error instanceof ApiError) {
        setVerifyError(error.message);
      } else {
        setVerifyError('Failed to resend code. Please try again.');
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Verify Email</CardTitle>
        <CardDescription>
          We&apos;ve sent a verification code to{' '}
          <strong>{email || 'your email'}</strong>.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onVerify)}>
        <CardContent className="space-y-6">
          {verifyError && (
            <Alert variant="destructive">
              <AlertDescription>{verifyError}</AlertDescription>
            </Alert>
          )}

          {resendMessage && (
            <Alert className="border-blue-500 text-blue-600">
              <AlertDescription>{resendMessage}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col items-center space-y-4">
            <Label htmlFor="otp" className="sr-only">
              One-Time Password
            </Label>
            <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <p className="text-sm text-muted-foreground text-center">
              Enter the 6-digit code sent to your inbox.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            disabled={otp.length !== 6 || isSubmitting}
          >
            {isSubmitting ? 'Verifying...' : 'Verify Email'}
          </Button>

          <div className="text-center text-sm">
            Didn&apos;t receive the code?{' '}
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto font-medium"
              disabled={isResending || !email}
              onClick={handleResendOtp}
            >
              {isResending ? 'Resending...' : 'Resend OTP'}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
