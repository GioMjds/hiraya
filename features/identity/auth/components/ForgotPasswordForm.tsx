'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { auth } from '@/repositories/identity/auth';
import { ApiError } from '@/configs/fetch';

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
        // Map field-specific errors from backend to form fields
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

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
      </CardHeader>

      <CardContent>
        {errors.root && (
          <div className="mb-4 text-sm text-red-600">{errors.root.message}</div>
        )}

        {isSubmitSuccessful && step === 'email' && (
          <div className="mb-4 text-sm text-green-600">
            Password reset successfully! You can now log in with your new
            password.
          </div>
        )}

        {/* Step 1: Email */}
        {step === 'email' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter your email address and we&apos;ll send you a code to reset
              your password.
            </p>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
                })}
                placeholder="you@example.com"
                className="mt-1"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="default"
                disabled={isSubmitting}
                onClick={handleSubmit(onEmailSubmit)}
              >
                {isSubmitting ? 'Sending...' : 'Send reset code'}
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 'otp' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              We&apos;ve sent a verification code to{' '}
              <strong>{getValues('email')}</strong>. Please enter it below.
            </p>

            <div>
              <Label>Verification code</Label>
              <Input
                type="text"
                {...register('otp', {
                  required: 'Verification code is required',
                  pattern: {
                    value: /^\d{6}$/,
                    message: 'Code must be 6 digits',
                  },
                })}
                placeholder="000000"
                maxLength={6}
                className="mt-1"
              />
              {errors.otp && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.otp.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Button type="button" variant="ghost" onClick={handleBack}>
                Back
              </Button>
              <Button
                type="button"
                variant="default"
                disabled={isSubmitting}
                onClick={handleSubmit(onOtpSubmit)}
              >
                {isSubmitting ? 'Verifying...' : 'Verify code'}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 'password' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Create a new password for your account.
            </p>

            <div>
              <Label>New password</Label>
              <Input
                type="password"
                {...register('newPassword', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'At least 8 characters' },
                })}
                placeholder="••••••••"
                className="mt-1"
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <Label>Confirm new password</Label>
              <Input
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm password',
                })}
                placeholder="••••••••"
                className="mt-1"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Button type="button" variant="ghost" onClick={handleBack}>
                Back
              </Button>
              <Button
                type="button"
                variant="default"
                disabled={isSubmitting}
                onClick={handleSubmit(onPasswordSubmit)}
              >
                {isSubmitting ? 'Resetting...' : 'Reset password'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter />
    </Card>
  );
}
