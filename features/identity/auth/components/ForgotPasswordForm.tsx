'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { auth } from '@/lib/api/identity/auth';
import { ApiError } from '@/configs/fetch';
import { Mail, KeyRound, Lock, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

type Step = 'email' | 'otp' | 'password';

type FormData = {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
};

export function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>('email');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
    getValues,
    reset,
  } = useForm<FormData>({ mode: 'onSubmit' });

  async function onEmailSubmit() {
    const email = getValues('email');

    try {
      await auth.forgotPasswordRequest({ email });
      setStep('otp');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.details) {
          for (const [key, msgs] of Object.entries(err.details)) {
            const field = key.split('.').pop() || key;
            setError(field as keyof FormData, {
              type: 'server',
              message: Array.isArray(msgs) ? msgs[0] : String(msgs),
            });
          }
          return;
        }

        setError('root', {
          type: 'manual',
          message: err.message,
        });
        return;
      }

      if (err instanceof Error) {
        setError('root', {
          type: 'manual',
          message: err.message,
        });
      }
    }
  }

  async function onOtpSubmit() {
    const { email, otp } = getValues();

    try {
      await auth.forgotPasswordVerify({ email, otp });
      setStep('password');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.details) {
          for (const [key, msgs] of Object.entries(err.details)) {
            const field = key.split('.').pop() || key;
            setError(field as keyof FormData, {
              type: 'server',
              message: Array.isArray(msgs) ? msgs[0] : String(msgs),
            });
          }
          return;
        }

        setError('root', {
          type: 'manual',
          message: err.message,
        });
        return;
      }

      if (err instanceof Error) {
        setError('root', {
          type: 'manual',
          message: err.message,
        });
      }
    }
  }

  async function onPasswordSubmit(values: FormData) {
    if (values.newPassword.length < 8) {
      setError('newPassword', {
        message: 'Password must be at least 8 characters',
      });
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      setError('confirmPassword', {
        message: 'Passwords do not match',
      });
      return;
    }

    try {
      await auth.forgotPasswordReset({
        email: values.email,
        otp: values.otp,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmPassword,
      });

      reset();
      setStep('email');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.details) {
          for (const [key, msgs] of Object.entries(err.details)) {
            const field = key.split('.').pop() || key;
            setError(field as keyof FormData, {
              type: 'server',
              message: Array.isArray(msgs) ? msgs[0] : String(msgs),
            });
          }
          return;
        }

        setError('root', {
          type: 'manual',
          message: err.message,
        });
        return;
      }

      if (err instanceof Error) {
        setError('root', {
          type: 'manual',
          message: err.message,
        });
      }
    }
  }

  function handleBack() {
    if (step === 'otp') {
      setStep('email');
    } else if (step === 'password') {
      setStep('otp');
    }
  }

  const stepIcons = {
    email: Mail,
    otp: KeyRound,
    password: Lock,
  };

  const stepTitles = {
    email: 'Reset your password',
    otp: 'Verify your identity',
    password: 'Create new password',
  };

  const stepDescriptions = {
    email: 'Enter your email address to receive a verification code',
    otp: 'Enter the 6-digit code we sent to your email',
    password: 'Choose a strong password for your account',
  };

  const StepIcon = stepIcons[step];

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-hidden border-0 shadow-2xl">
        <div className="relative overflow-hidden bg-linear-to-br from-[#6C5CE7] to-[#5B4AD8] p-8 text-white">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative">
            {step !== 'email' && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="mb-4 -ml-2 text-white hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <StepIcon className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">Hiraya</span>
            </div>
            <h1 className="mb-3 text-3xl font-bold tracking-tight">
              {stepTitles[step]}
            </h1>
            <p className="text-white/90">
              {stepDescriptions[step]}
            </p>
          </div>
        </div>

        <div className="p-8">
          {errors.root && (
            <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">{errors.root.message}</AlertDescription>
            </Alert>
          )}

          {isSubmitSuccessful && step === 'email' && (
            <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription className="ml-2">
                Password reset successfully! You can now log in with your new password.
              </AlertDescription>
            </Alert>
          )}

          {step === 'email' && (
            <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-12 rounded-xl pl-11 transition-all focus:ring-2 focus:ring-[#6C5CE7]/20"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email format' }
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="group h-12 w-full rounded-xl bg-linear-to-r from-[#6C5CE7] to-[#5B4AD8] text-base font-semibold text-white shadow-lg shadow-[#6C5CE7]/25 transition-all hover:shadow-xl hover:shadow-[#6C5CE7]/30"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send Verification Code
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleSubmit(onOtpSubmit)} className="space-y-6">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  We&apos;ve sent a verification code to
                </p>
                <p className="mt-1 font-semibold text-foreground">
                  {getValues('email')}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium">
                  Verification Code
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="h-12 rounded-xl pl-11 font-mono text-lg tracking-wider transition-all focus:ring-2 focus:ring-[#6C5CE7]/20"
                    {...register('otp', {
                      required: 'Verification code is required',
                      pattern: {
                        value: /^\d{6}$/,
                        message: 'Code must be 6 digits',
                      },
                    })}
                  />
                </div>
                {errors.otp && (
                  <p className="text-sm text-red-600">{errors.otp.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="group h-12 w-full rounded-xl bg-linear-to-rrom-[#6C5CE7] to-[#5B4AD8] text-base font-semibold text-white shadow-lg shadow-[#6C5CE7]/25 transition-all hover:shadow-xl hover:shadow-[#6C5CE7]/30"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Verify Code
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      className="h-12 rounded-xl pl-11 transition-all focus:ring-2 focus:ring-[#6C5CE7]/20"
                      {...register('newPassword', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters',
                        },
                      })}
                    />
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-red-600">{errors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      className="h-12 rounded-xl pl-11 transition-all focus:ring-2 focus:ring-[#6C5CE7]/20"
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                      })}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">
                  Your password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
                </p>
              </div>

              <Button
                type="submit"
                className="group h-12 w-full rounded-xl bg-linear-to-r from-[#6C5CE7] to-[#5B4AD8] text-base font-semibold text-white shadow-lg shadow-[#6C5CE7]/25 transition-all hover:shadow-xl hover:shadow-[#6C5CE7]/30"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Resetting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Reset Password
                    <CheckCircle2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                  </span>
                )}
              </Button>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}
