'use client';

import Link from 'next/link';
import { useOptimistic, useState, useTransition } from 'react';
import { AuthModal } from '@/features/identity/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { auth, LoginData } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/configs';
import { AlertCircle, Eye, EyeClosed, Loader2 } from 'lucide-react';

interface OptimisticState {
  message: string;
  type: 'success' | 'error' | 'idle' | 'loading';
}

export default function LoginModalPage() {
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
    <AuthModal title='Welcome Back to Hiraya!'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* Optimistic loading state */}
          {optimisticState.type === 'loading' && (
            <Alert className="border-blue-200 bg-blue-50">
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription className="flex items-center">
                {optimisticState.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Optimistic success state */}
          {optimisticState.type === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="flex items-center text-green-800">
                {optimisticState.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Error state */}
          {errors.root && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center">
                {errors.root.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email" className='text-background'>Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              disabled={isSubmitting}
              className={errors.email ? 'border-red-500' : 'text-gray-800'}
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

          {/* Password field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className='text-background'>Password</Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`pr-10 ${errors.password ? 'border-red-500' : 'text-gray-800'}`}
                placeholder='********'
                autoComplete="current-password"
                disabled={isSubmitting}
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
                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
            <Link
              href="/forgot"
              className="text-sm font-medium text-background hover:underline inline-block"
            >
              Forgot password?
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className={`w-full ${isSubmitting ? 'cursor-not-allowed' : ''}`}
            disabled={isSubmitting || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>

          <div className="text-center text-sm text-background">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-gray-600 hover:underline"
            >
              Register
            </Link>
          </div>
        </CardFooter>
      </form>
    </AuthModal>
  );
}