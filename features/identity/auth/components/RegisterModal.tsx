'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useOptimistic, useState, useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Eye, EyeClosed, Loader2 } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { auth, RegisterData } from '@/lib/api/identity/auth';
import { ApiError } from '@/configs';

interface OptimisticState {
  message: string;
  type: 'success' | 'error' | 'idle' | 'loading';
}

export function RegisterModal() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
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
      setOptimisticState({ message: 'Creating account...', type: 'loading' });

      try {
        await auth.register(data);
        setOptimisticState({
          message: 'Redirecting to verification...',
          type: 'success',
        });
        router.push(`/verify?email=${encodeURIComponent(data.email)}`);
      } catch (error) {
        setOptimisticState({ message: '', type: 'error' });
        if (error instanceof ApiError) {
          setError('root', { type: 'manual', message: error.message });
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
      <div className="space-y-1.5 mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Create an account</h2>
        <p className="text-sm text-muted-foreground">
          Enter your details to get started with Hiraya.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        {errors.root?.message && (
          <Alert variant="destructive">
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="modal-firstName">First Name</Label>
            <Input
              id="modal-firstName"
              placeholder="John"
              disabled={isSubmitting || isPending}
              {...register('firstName', {
                required: 'First name is required',
                minLength: { value: 2, message: 'At least 2 characters' },
              })}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="modal-lastName">Last Name</Label>
            <Input
              id="modal-lastName"
              placeholder="Doe"
              disabled={isSubmitting || isPending}
              {...register('lastName', {
                required: 'Last name is required',
                minLength: { value: 2, message: 'At least 2 characters' },
              })}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="modal-reg-email">Email</Label>
          <Input
            id="modal-reg-email"
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
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="modal-reg-password">Password</Label>
          <div className="relative">
            <Input
              id="modal-reg-password"
              type={showPassword ? 'text' : 'password'}
              className={`pr-10 ${errors.password ? 'border-destructive' : ''}`}
              autoComplete="new-password"
              disabled={isSubmitting || isPending}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'At least 8 characters' },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              disabled={isSubmitting || isPending}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="modal-confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="modal-confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className={`pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
              autoComplete="new-password"
              disabled={isSubmitting || isPending}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              disabled={isSubmitting || isPending}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || isPending}
        >
          {isSubmitting || isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating account...
            </>
          ) : (
            'Register'
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </AuthModal>
  );
}
