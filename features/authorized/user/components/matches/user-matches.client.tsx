'use client';

import Link from 'next/link';
import { useOptimistic, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { ApiError } from '@/configs/fetch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, ArrowRight, Loader2, Target } from 'lucide-react';
import {
  useComputeUserMatches,
  useGetUserMatches,
} from '@/features/authorized/user/hooks';

interface UserMatchesClientProps {
  userId: string;
}

interface ComputeMatchesFormValues {
  algorithmVersion: string;
  roleIdsRaw: string;
}

interface OptimisticState {
  message: string;
  type: 'idle' | 'loading' | 'success' | 'error';
}

export function UserMatchesClient({ userId }: UserMatchesClientProps) {
  const [optimisticState, setOptimisticState] = useOptimistic<
    OptimisticState,
    Partial<OptimisticState>
  >({ message: '', type: 'idle' }, (currentState, optimisticValue) => ({
    ...currentState,
    ...optimisticValue,
  }));
  const [isTransitionPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ComputeMatchesFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      algorithmVersion: 'v1.0.0',
      roleIdsRaw: '',
    },
  });

  const { data: userMatches, isLoading } = useGetUserMatches();
  const { mutateAsync: computeMatches, isPending } = useComputeUserMatches();

  const onSubmit = async (values: ComputeMatchesFormValues) => {
    startTransition(async () => {
      setOptimisticState({
        message: 'Computing matches...',
        type: 'loading',
      });

      const roleIds = values.roleIdsRaw
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      try {
        await computeMatches({
          algorithmVersion: values.algorithmVersion.trim() || undefined,
          roleIds: roleIds.length > 0 ? roleIds : undefined,
        });

        setOptimisticState({
          message: 'Matches computed successfully.',
          type: 'success',
        });
      } catch (error) {
        setOptimisticState({
          message: '',
          type: 'error',
        });
        if (error instanceof ApiError) {
          setError('root', {
            type: 'server',
            message: error.message,
          });
          return;
        }

        setError('root', {
          type: 'server',
          message: error instanceof Error ? error.message : 'Failed to compute matches.',
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Matches</h1>
          <p className="text-sm text-muted-foreground">
            Capability-based fit scoring across roles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/user/${userId}/dashboard`}>Back to dashboard</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">Compute settings</CardTitle>
            <Target className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {optimisticState.type === 'loading' && (
              <Alert className="border-blue-200 bg-blue-50">
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>{optimisticState.message}</AlertDescription>
              </Alert>
            )}

            {optimisticState.type === 'success' && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
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

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Algorithm version</Label>
                <Input
                  placeholder="v1.0.0"
                  disabled={isSubmitting || isPending || isTransitionPending}
                  {...register('algorithmVersion')}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={isSubmitting || isPending || isTransitionPending}>
                {isPending || isTransitionPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Computing...
                  </>
                ) : (
                  'Compute matches'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">Your results</CardTitle>
            <Badge variant="outline">{userMatches?.length ?? 0} matches</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {isLoading ? (
              <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                Loading matches...
              </div>
            ) : userMatches && userMatches.length > 0 ? (
              userMatches.map((match) => (
                <div
                  key={match.id}
                  className="rounded-lg border p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-medium">{match.role?.title ?? 'Role unavailable'}</div>
                      <Badge variant="outline">{match.gapCount} gaps</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 w-full sm:w-72 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${Math.max(0, Math.min(match.score, 100))}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Fit score: {Math.round(match.score)}%
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/user/${userId}/matches/${match.id}`}>
                      Open
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))
            ) : (
              <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                No matches yet.
              </div>
            )}
          </div>
          <Separator />
          <div className="text-sm text-muted-foreground">
            Each match explains your strengths and highlights high-impact skill gaps.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
