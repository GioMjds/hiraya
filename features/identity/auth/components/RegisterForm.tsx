'use client';

import Link from 'next/link';
import { useState, useOptimistic, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { auth, RegisterData } from '@/lib/api/identity/auth';
import { ApiError } from '@/configs';
import { Eye, EyeClosed, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GoogleOAuthButton } from '@/components/shared/google-login';

interface OptimisticState {
  message: string;
  type: 'success' | 'error' | 'idle' | 'loading';
}

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
    control,
  } = useForm<RegisterData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [optimisticState, setOptimisticState] = useOptimistic<
    OptimisticState,
    Partial<OptimisticState>
  >({ message: '', type: 'idle' }, (currentState, optimisticValue) => ({
    ...currentState,
    ...optimisticValue,
  }));

  const [isPending, startTransition] = useTransition();

  const password = useWatch({ control, name: 'password' });

  const onSubmit = async (data: RegisterData) => {
    startTransition(async () => {
      setOptimisticState({
        message: 'Creating account...',
        type: 'loading',
      });

      try {
        await auth.register(data);
        setOptimisticState({
          message: 'Redirecting to verification...',
          type: 'success',
        });
        router.push(`/verify?email=${encodeURIComponent(data.email)}`);
      } catch (error) {
        setOptimisticState({
          message: 'An error occurred during registration.',
          type: 'error',
        });

        if (error instanceof ApiError) {
          setError('root', {
            type: 'manual',
            message: error.message,
          });
          if (error.details) {
            Object.entries(error.details).forEach(([field, messages]) => {
              setError(field as keyof RegisterData, {
                type: 'manual',
                message: messages[0],
              });
            });
          }
        }
      }
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#6C5CE7] via-[#7C6FE8] to-[#8B7FE9] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="h-2 w-2 rounded-full bg-white" />
              Hiraya
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Start Your Journey
            <br />
            to Success
          </h1>
          <p className="text-lg text-white/90 mb-8">
            Join our platform and build a skill-first profile backed by evidence,
            not just credentials.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Skill-based matching</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Fast matching</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-2 bg-background overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-4">
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Build a skill-first profile and get matched faster
            </p>
          </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {optimisticState.type === 'loading' && (
          <Alert className="border-blue-200 bg-blue-50">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription className="flex items-center">
              {optimisticState.message}
            </AlertDescription>
          </Alert>
        )}

        {optimisticState.type === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="flex items-center text-green-800">
              {optimisticState.message}
            </AlertDescription>
          </Alert>
        )}

        {errors.root && errors.root.message && (
          <Alert variant="destructive">
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder="First name"
              disabled={isSubmitting || isPending}
              className={`h-12 rounded-xl bg-white ${errors.firstName ? 'border-red-500' : 'border-border'} shadow-sm`}
              {...register('firstName', {
                required: 'First name is required',
                minLength: {
                  value: 2,
                  message: 'First name must be at least 2 characters',
                },
              })}
            />
            {errors.firstName && (
              <p className="text-sm text-red-600">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="Last name"
              disabled={isSubmitting || isPending}
              className={`h-12 rounded-xl bg-white ${errors.lastName ? 'border-red-500' : 'border-border'} shadow-sm`}
              {...register('lastName', {
                required: 'Last name is required',
                minLength: {
                  value: 2,
                  message: 'Last name must be at least 2 characters',
                },
              })}
            />
            {errors.lastName && (
              <p className="text-sm text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            disabled={isSubmitting || isPending}
            className={`h-12 rounded-xl bg-white ${errors.email ? 'border-red-500' : 'border-border'} shadow-sm`}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`h-12 rounded-xl bg-white pr-10 ${errors.password ? 'border-red-500' : 'border-border'} shadow-sm`}
              autoComplete="current-password"
              disabled={isSubmitting || isPending}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={isSubmitting || isPending}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className={`h-12 rounded-xl bg-white pr-10 ${errors.confirmPassword ? 'border-red-500' : 'border-border'} shadow-sm`}
              autoComplete="new-password"
              disabled={isSubmitting || isPending}
              aria-label={
                showConfirmPassword ? 'Hide password' : 'Show password'
              }
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={isSubmitting || isPending}
              aria-label={
                showConfirmPassword ? 'Hide password' : 'Show password'
              }
            >
              {showConfirmPassword ? (
                <EyeClosed size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-[#6C5CE7] text-white shadow-lg shadow-[#6C5CE7]/25 hover:bg-[#5B4AD8]"
          disabled={isSubmitting || isPending}
        >
          {isSubmitting || isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>

        <div className="pt-2">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <GoogleOAuthButton />
        </div>

        <div className="pt-4 text-left text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[#6C5CE7]">
            Login
          </Link>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
}
