'use client';

import Link from 'next/link';
import { useMemo, useOptimistic, useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  useAddUserSkill,
  useGetUserSkillOptions,
  useGetUserSkills,
  useRemoveUserSkill,
  useUpdateUserSkill,
} from '@/features/authorized/user/hooks';
import type { ProficiencyLevel } from '@/lib/api/authorized/user';
import { UserWorkspaceHero } from '../shared/user-workspace-hero';

interface UserSkillsClientProps {
  userId: string;
}

interface AddSkillFormValues {
  skillId: string;
  level: ProficiencyLevel;
  confidence: number;
  isPrimary: boolean;
}

interface EditSkillFormValues {
  level: ProficiencyLevel;
  confidence: number;
  isPrimary: boolean;
}

interface OptimisticState {
  message: string;
  type: 'idle' | 'loading' | 'success' | 'error';
}

const LEVEL_OPTIONS: ProficiencyLevel[] = [
  'novice',
  'beginner',
  'intermediate',
  'advanced',
  'expert',
];

const toTitle = (value: string) =>
  value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export function UserSkillsClient({ userId }: UserSkillsClientProps) {
  const [search, setSearch] = useState<string>('');
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [removingSkillId, setRemovingSkillId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [optimisticState, setOptimisticState] = useOptimistic<
    OptimisticState,
    Partial<OptimisticState>
  >({ message: '', type: 'idle' }, (currentState, optimisticValue) => ({
    ...currentState,
    ...optimisticValue,
  }));
  const [isPending, startTransition] = useTransition();

  const {
    control: addControl,
    register: addRegister,
    handleSubmit: handleAddSubmit,
    reset: resetAddForm,
    setError: setAddError,
    formState: { errors: addErrors, isSubmitting: isAddSubmitting },
  } = useForm<AddSkillFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      skillId: '',
      level: 'intermediate',
      confidence: 70,
      isPrimary: false,
    },
  });

  const {
    control: editControl,
    register: editRegister,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    setError: setEditError,
    formState: { errors: editErrors, isSubmitting: isEditSubmitting },
  } = useForm<EditSkillFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      level: 'intermediate',
      confidence: 70,
      isPrimary: false,
    },
  });

  const { data: userSkills, isLoading } = useGetUserSkills();
  const { data: availableSkills } = useGetUserSkillOptions();
  const { mutateAsync: addUserSkill, isPending: isAdding } = useAddUserSkill();
  const { mutateAsync: updateUserSkill, isPending: isUpdating } =
    useUpdateUserSkill();
  const { mutateAsync: removeUserSkill, isPending: isRemoving } =
    useRemoveUserSkill();

  const usedSkillIds = new Set((userSkills ?? []).map((item) => item.skillId));
  const selectableSkills = (availableSkills ?? []).filter(
    (item) => !usedSkillIds.has(item.id),
  );

  const filteredSkills = useMemo(() => {
    if (!userSkills) return [];
    const term = search.trim().toLowerCase();
    if (!term) return userSkills;

    return userSkills.filter((item) => {
      const name = item.skill?.name?.toLowerCase() ?? '';
      const level = item.level.toLowerCase();
      return (
        name.includes(term) ||
        level.includes(term) ||
        item.skillId.toLowerCase().includes(term)
      );
    });
  }, [search, userSkills]);

  const primarySkillsCount =
    userSkills?.filter((item) => item.isPrimary).length ?? 0;

  const startEditing = (
    skillId: string,
    level: ProficiencyLevel,
    confidence: number,
    isPrimary: boolean,
  ) => {
    setEditingSkillId(skillId);
    resetEditForm({
      level,
      confidence,
      isPrimary,
    });
  };

  const onSubmitAddSkill = async (values: AddSkillFormValues) => {
    startTransition(async () => {
      setOptimisticState({
        message: 'Adding skill...',
        type: 'loading',
      });

      try {
        await addUserSkill({
          skillId: values.skillId,
          level: values.level,
          confidence: values.confidence,
          isPrimary: values.isPrimary,
        });

        resetAddForm({
          skillId: '',
          level: 'intermediate',
          confidence: 70,
          isPrimary: false,
        });
        setIsAddDialogOpen(false);
        setOptimisticState({
          message: 'Skill added successfully.',
          type: 'success',
        });
      } catch (error) {
        setOptimisticState({
          message: '',
          type: 'error',
        });
        if (error instanceof ApiError && error.details) {
          const details = Object.entries(error.details)
            .flatMap(([field, messages]) =>
              messages.map((message) => `${field}: ${message}`),
            )
            .join(' | ');
          setAddError('root', {
            type: 'server',
            message: details || error.message,
          });
          return;
        }

        setAddError('root', {
          type: 'server',
          message: error instanceof Error ? error.message : 'Failed to add skill.',
        });
      }
    });
  };

  const onSubmitEditSkill = async (values: EditSkillFormValues) => {
    if (!editingSkillId) {
      return;
    }

    startTransition(async () => {
      setOptimisticState({
        message: 'Saving changes...',
        type: 'loading',
      });

      try {
        await updateUserSkill({
          userSkillId: editingSkillId,
          data: {
            level: values.level,
            confidence: values.confidence,
            isPrimary: values.isPrimary,
          },
        });

        setEditingSkillId(null);
        setOptimisticState({
          message: 'Skill updated successfully.',
          type: 'success',
        });
      } catch (error) {
        setOptimisticState({
          message: '',
          type: 'error',
        });
        setEditError('root', {
          type: 'server',
          message:
            error instanceof Error ? error.message : 'Failed to update skill.',
        });
      }
    });
  };

  const handleRemove = async (userSkillId: string) => {
    try {
      await removeUserSkill(userSkillId);
      setRemovingSkillId(null);
      if (editingSkillId === userSkillId) {
        setEditingSkillId(null);
      }
    } catch (error) {
      setAddError('root', {
        type: 'server',
        message: error instanceof Error ? error.message : 'Failed to remove skill.',
      });
    }
  };

  const selectedRemovingSkill =
    (userSkills ?? []).find((item) => item.id === removingSkillId) ?? null;

  return (
    <div className="space-y-6">
      <UserWorkspaceHero
        title="Skills"
        description="Declare your current skills and confidence levels to improve matching quality."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href={`/user/${userId}/dashboard`}>Back to dashboard</Link>
            </Button>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              disabled={selectableSkills.length === 0}
            >
              Add skill
            </Button>
          </>
        }
        badges={[
          { label: 'Declared', value: userSkills?.length ?? 0 },
          { label: 'Primary', value: primarySkillsCount, variant: 'outline' },
          { label: 'Available', value: selectableSkills.length, variant: 'outline' },
        ]}
      />

      {(addErrors.root || editErrors.root || optimisticState.type === 'success') && (
        <Card>
          <CardContent className="pt-6">
            {optimisticState.type === 'success' && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  {optimisticState.message}
                </AlertDescription>
              </Alert>
            )}
            {(addErrors.root || editErrors.root) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {addErrors.root?.message ?? editErrors.root?.message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">Your skill map</CardTitle>
            <Badge variant="secondary">{userSkills?.length ?? 0}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search your skills..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <Separator />

          <div className="grid gap-3">
            {isLoading ? (
              <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                Loading skills...
              </div>
            ) : filteredSkills.length > 0 ? (
              filteredSkills.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="font-medium">{item.skill?.name ?? item.skillId}</div>
                    <div className="text-xs text-muted-foreground">
                      Confidence: {item.confidence}%
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs uppercase">
                      {toTitle(item.level)}
                    </Badge>
                    {item.isPrimary && <Badge variant="outline">Primary</Badge>}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        startEditing(item.id, item.level, item.confidence, item.isPrimary)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRemovingSkillId(item.id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Remove
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/user/${userId}/skills/${item.id}`}>
                        Open
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                No skills found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Add a skill
            </AlertDialogTitle>
            <AlertDialogDescription>
              Add a new declared skill with level and confidence.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form onSubmit={handleAddSubmit(onSubmitAddSkill)} className="space-y-3">
            {optimisticState.type === 'loading' && (
              <Alert className="border-blue-200 bg-blue-50">
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>{optimisticState.message}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Skill</Label>
              <Controller
                name="skillId"
                control={addControl}
                rules={{ required: 'Please select a skill to add.' }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectableSkills.map((skill) => (
                        <SelectItem key={skill.id} value={skill.id}>
                          {skill.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {addErrors.skillId && (
                <p className="text-sm text-destructive">{addErrors.skillId.message}</p>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Level</Label>
                <Controller
                  name="level"
                  control={addControl}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) =>
                        field.onChange(value as ProficiencyLevel)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {LEVEL_OPTIONS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {toTitle(level)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Confidence (0-100)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  disabled={isAddSubmitting || isPending || isAdding}
                  {...addRegister('confidence', {
                    valueAsNumber: true,
                    required: 'Confidence is required',
                    min: { value: 0, message: 'Confidence must be at least 0' },
                    max: { value: 100, message: 'Confidence must be at most 100' },
                  })}
                />
                {addErrors.confidence && (
                  <p className="text-sm text-destructive">
                    {addErrors.confidence.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Primary skill</Label>
              <div className="flex h-10 items-center rounded-md border px-3">
                <Controller
                  name="isPrimary"
                  control={addControl}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button type="button" variant="outline" disabled={isAddSubmitting || isPending || isAdding}>
                  Cancel
                </Button>
              </AlertDialogCancel>
              <Button
                type="submit"
                disabled={
                  isAddSubmitting ||
                  isPending ||
                  isAdding ||
                  selectableSkills.length === 0
                }
              >
                {isPending || isAdding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add skill'
                )}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(editingSkillId)}
        onOpenChange={(open) => {
          if (!open) setEditingSkillId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit skill</AlertDialogTitle>
            <AlertDialogDescription>
              Update the selected skill level, confidence, and primary flag.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form onSubmit={handleEditSubmit(onSubmitEditSkill)} className="space-y-3">
            {optimisticState.type === 'loading' && (
              <Alert className="border-blue-200 bg-blue-50">
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>{optimisticState.message}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Level</Label>
              <Controller
                name="level"
                control={editControl}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value as ProficiencyLevel)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVEL_OPTIONS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {toTitle(level)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Confidence (0-100)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                disabled={isEditSubmitting || isPending || isUpdating}
                {...editRegister('confidence', {
                  valueAsNumber: true,
                  required: 'Confidence is required',
                  min: {
                    value: 0,
                    message: 'Confidence must be at least 0',
                  },
                  max: {
                    value: 100,
                    message: 'Confidence must be at most 100',
                  },
                })}
              />
              {editErrors.confidence && (
                <p className="text-sm text-destructive">{editErrors.confidence.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Primary skill</Label>
              <div className="flex h-10 items-center rounded-md border px-3">
                <Controller
                  name="isPrimary"
                  control={editControl}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button type="button" variant="outline" disabled={isEditSubmitting || isPending || isUpdating}>
                  Cancel
                </Button>
              </AlertDialogCancel>
              <Button type="submit" disabled={isEditSubmitting || isPending || isUpdating}>
                {isPending || isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save changes'
                )}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(removingSkillId)}
        onOpenChange={(open) => {
          if (!open) setRemovingSkillId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this skill?</AlertDialogTitle>
            <AlertDialogDescription>
              This action removes the skill from your profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="text-sm text-muted-foreground">
            This will remove{' '}
            <span className="font-medium text-foreground">
              {selectedRemovingSkill?.skill?.name ?? 'this skill'}
            </span>{' '}
            from your profile.
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline" disabled={isRemoving}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={isRemoving}
              onClick={() => {
                if (removingSkillId) {
                  void handleRemove(removingSkillId);
                }
              }}
            >
              {isRemoving ? 'Removing...' : 'Remove skill'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
