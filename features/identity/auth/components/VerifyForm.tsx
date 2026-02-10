'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { auth, VerifyEmailData } from '@/lib/api/identity/auth';
import { ApiError } from '@/configs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Mail,
  RefreshCw,
} from 'lucide-react';

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
      router.push('/');
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
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-hidden border-0 shadow-2xl">
        <div className="relative overflow-hidden bg-linear-to-br from-[#6C5CE7] to-[#5B4AD8] p-8 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white blur-3xl" />
            <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-white blur-3xl" />
          </div>
          <div className="relative">
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Mail className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">Hiraya</span>
            </div>
            <h1 className="mb-3 text-3xl font-bold tracking-tight">
              Verify your email
            </h1>
            <p className="text-white/90">
              We&apos;ve sent a 6-digit verification code to
            </p>
            <p className="mt-1 font-semibold">{email || 'your email'}</p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit(onVerify)} className="space-y-6">
            {verifyError && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="ml-2">
                  {verifyError}
                </AlertDescription>
              </Alert>
            )}

            {resendMessage && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription className="ml-2">
                  {resendMessage}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Enter verification code
              </Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(val) => setOtp(val)}
                  className="gap-2"
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot
                      index={0}
                      className="h-13 w-13 rounded-xl border-2 text-lg font-semibold transition-all focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20"
                    />
                    <InputOTPSlot
                      index={1}
                      className="h-13 w-13 rounded-xl border-2 text-lg font-semibold transition-all focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20"
                    />
                    <InputOTPSlot
                      index={2}
                      className="h-13 w-13 rounded-xl border-2 text-lg font-semibold transition-all focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20"
                    />
                    <InputOTPSlot
                      index={3}
                      className="h-13 w-13 rounded-xl border-2 text-lg font-semibold transition-all focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20"
                    />
                    <InputOTPSlot
                      index={4}
                      className="h-13 w-13 rounded-xl border-2 text-lg font-semibold transition-all focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20"
                    />
                    <InputOTPSlot
                      index={5}
                      className="h-13 w-13 rounded-xl border-2 text-lg font-semibold transition-all focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Enter the 6-digit code sent to your inbox
              </p>
            </div>

            <Button
              type="submit"
              className="group h-12 w-full rounded-xl bg-linear-to-r from-[#6C5CE7] to-[#5B4AD8] text-base font-semibold text-white shadow-lg shadow-[#6C5CE7]/25 transition-all hover:shadow-xl hover:shadow-[#6C5CE7]/30"
              disabled={otp.length !== 6 || isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Verify Email
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Didn&apos;t receive the code?{' '}
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 font-semibold text-[#6C5CE7] hover:text-[#5B4AD8]"
                disabled={isResending || !email}
                onClick={handleResendOtp}
              >
                {isResending ? (
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Resending...
                  </span>
                ) : (
                  'Resend code'
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
