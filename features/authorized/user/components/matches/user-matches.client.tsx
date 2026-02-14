'use client';

import Link from 'next/link';
import { useOptimistic, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { ApiError } from '@/configs/fetch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, ArrowRight, Loader2, ShieldCheck, Target } from 'lucide-react';
import {
  useComputeUserMatches,
  useGetMatchHealth,
  useGetUserMatches,
} from '@/features/authorized/user/hooks';
import { UserWorkspaceHero } from '../shared/user-workspace-hero';

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
  const [isComputeOpen, setIsComputeOpen] = useState<boolean>(false);
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
      algorithmVersion: 'internal-v2.0.0',
      roleIdsRaw: '',
    },
  });

  const { data: userMatches, isLoading } = useGetUserMatches();
  const { data: matchHealth } = useGetMatchHealth();
  const { mutateAsync: computeMatches, isPending } = useComputeUserMatches();
  const totalMatches = userMatches?.length ?? 0;

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
        setIsComputeOpen(false);
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
      <UserWorkspaceHero
        title="Matches"
        description="Compute role-fit results from your evidence-backed capabilities and review high-impact gaps."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href={`/user/${userId}/dashboard`}>Back to dashboard</Link>
            </Button>
            <Button onClick={() => setIsComputeOpen(true)}>Compute settings</Button>
          </>
        }
        badges={[
          { label: 'Matches', value: totalMatches },
          {
            label: 'Engine',
            value: matchHealth?.matching_source ?? 'networkx-engine',
            variant: 'outline',
          },
          {
            label: 'Algorithm',
            value: matchHealth?.algorithm_version ?? 'engine-v2.0.0',
            variant: 'outline',
          },
        ]}
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">Compute settings</CardTitle>
            <Target className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
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

            <div className="rounded-lg border p-4 text-sm text-muted-foreground">
              Configure algorithm version and optional role IDs in a modal, then
              recompute to refresh results.
            </div>

            {matchHealth && (
              <div className="rounded-lg border p-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>
                    Canonical source: {matchHealth.canonical_source ?? 'api-internal'} ·
                    Engine: {matchHealth.matching_source ?? 'networkx-engine'} ·
                    Engine algo: {matchHealth.algorithm_version ?? 'engine-v2.0.0'}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button onClick={() => setIsComputeOpen(true)}>
                Open compute modal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">Your results</CardTitle>
            <Badge variant="outline">{totalMatches} matches</Badge>
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

      <AlertDialog open={isComputeOpen} onOpenChange={setIsComputeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Compute role matches</AlertDialogTitle>
            <AlertDialogDescription>
              Configure algorithm options before recomputing match results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3"
          >
            <div className="space-y-2">
              <Label className="text-sm font-medium">Algorithm version</Label>
              <Input
                placeholder="internal-v2.0.0"
                disabled={isSubmitting || isPending || isTransitionPending}
                {...register('algorithmVersion')}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Role IDs (optional)</Label>
              <Input
                placeholder="role-1, role-2"
                disabled={isSubmitting || isPending || isTransitionPending}
                {...register('roleIdsRaw')}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button type="button" variant="outline" disabled={isPending || isTransitionPending}>
                  Cancel
                </Button>
              </AlertDialogCancel>
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
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
