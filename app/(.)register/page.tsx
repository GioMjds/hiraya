'use client';

import Link from 'next/link';
import { AuthModal } from '@/features/identity/auth/components';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { useOptimistic, useState, useTransition } from 'react';
import { auth, RegisterData } from '@/lib/api';
import { ApiError } from '@/configs';
import { Eye, EyeClosed, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OptimisticState {
  message: string;
  type: 'success' | 'error' | 'idle' | 'loading';
}

export default function RegisterModalPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
    <AuthModal title="Join Hiraya Today!">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
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
          {errors.root && errors.root.message && (
            <Alert variant="destructive">
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                disabled={isSubmitting || isPending}
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
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                disabled={isSubmitting || isPending}
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              autoComplete="email"
              disabled={isSubmitting || isPending}
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
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
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
                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isSubmitting || isPending}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeClosed size={25} /> : <Eye size={25} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                autoComplete="new-password"
                disabled={isSubmitting || isPending}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isSubmitting || isPending}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeClosed size={25} /> : <Eye size={25} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className={`w-full ${isSubmitting || isPending ? 'cursor-not-allowed' : ''}`}
            disabled={isSubmitting || isPending}
          >
            {isSubmitting || isPending ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creating account...
              </>
            ) : (
              'Register'
            )}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Login
            </Link>
          </div>
        </CardFooter>
      </form>
    </AuthModal>
  );
}
