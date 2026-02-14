'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useOptimistic, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { AlertCircle, Eye, EyeClosed, Loader2 } from 'lucide-react';
import { AuthModal } from './AuthModal';
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

function getPostLoginRoute(role: string, userId: string): string {
  switch (role.toLowerCase()) {
    case 'admin':
      return '/admin';
    case 'employer':
      return `/employer/${userId}/dashboard`;
    case 'user':
      return `/user/${userId}/dashboard`;
    default:
      return '/';
  }
}

export function LoginModal() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginData>();

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
      setOptimisticState({ message: 'Logging in...', type: 'loading' });

      try {
        const response = await auth.login(data);
        setOptimisticState({
          message: 'Login successful! Redirecting...',
          type: 'success',
        });
        router.push(
          getPostLoginRoute(response.user.role, response.user.id) as Route,
        );
      } catch (error) {
        setOptimisticState({ message: '', type: 'error' });
        if (error instanceof ApiError) {
          setError('root', { type: 'server', message: error?.message });
        }
      }
    });
  };

  return (
    <AuthModal title="Welcome Back to Hiraya!">
      <div className="space-y-1.5 mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {optimisticState.type === 'loading' && (
          <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>{optimisticState.message}</AlertDescription>
          </Alert>
        )}

        {optimisticState.type === 'success' && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
            <AlertDescription className="text-green-800 dark:text-green-200">
              {optimisticState.message}
            </AlertDescription>
          </Alert>
        )}

        {errors.root && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="modal-email">Email</Label>
          <Input
            id="modal-email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            disabled={isSubmitting || isPending}
            className={errors.email ? 'border-destructive' : ''}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address',
              },
            })}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="modal-password">Password</Label>
            <Link
              href="/forgot"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="modal-password"
              type={showPassword ? 'text' : 'password'}
              className={`pr-10 ${errors.password ? 'border-destructive' : ''}`}
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            'Log In'
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </AuthModal>
  );
}
