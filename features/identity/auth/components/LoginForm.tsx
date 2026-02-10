'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useOptimistic, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { AlertCircle, Eye, EyeClosed, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { auth, LoginData } from '@/lib/api';
import { ApiError } from '@/configs';

interface OptimisticState {
  message: string;
  type: 'success' | 'error' | 'idle' | 'loading';
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginData>({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
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

  const onSubmit = async (data: LoginData) => {
    startTransition(async () => {
      setOptimisticState({
        message: 'Logging in...',
        type: 'loading',
      });

      try {
        await auth.login(data);
        setOptimisticState({
          message: 'Login successful! Redirecting...',
          type: 'success',
        });
        router.push('/admin');
      } catch (error) {
        setOptimisticState({
          message: '',
          type: 'error',
        });
        if (error instanceof ApiError) {
          setError('root', {
            type: 'server',
            message: error?.message,
          });
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
            Welcome to Your
            <br />
            Special Place
          </h1>
          <p className="text-lg text-white/90 mb-8">
            Securely access your skill-based profile and discover opportunities
            tailored to your capabilities.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Evidence-backed skills</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Secure platform</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground lg:hidden">
              <span className="h-2 w-2 rounded-full bg-[#6C5CE7]" />
              Hiraya
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground">
              Holla, Welcome Back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Hey, welcome back to your special place
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

        {errors.root && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center">
              {errors.root.message}
            </AlertDescription>
          </Alert>
        )}

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
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address',
              },
            })}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
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
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isSubmitting || isPending}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4 rounded border-border text-[#6C5CE7] focus-visible:ring-2 focus-visible:ring-[#6C5CE7]"
            />
            Remember me
          </label>
          <Link href="/forgot" className="font-medium text-[#6C5CE7]">
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-[#6C5CE7] text-white shadow-lg shadow-[#6C5CE7]/25 hover:bg-[#5B4AD8]"
          disabled={isSubmitting || isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>

        <div className="pt-4 text-left text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-[#6C5CE7]">
            Sign Up
          </Link>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
}
