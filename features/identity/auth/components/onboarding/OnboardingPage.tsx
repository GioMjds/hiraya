'use client';

import {
  OnboardingStepOne,
  OnboardingStepTwo,
  OnboardingStepThree,
  OnboardingStepFour,
  OnboardingStepFive,
  OnboardingStepSix,
  OnboardingStepSeven,
  OnboardingStepEight,
} from '../onboarding';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ONBOARDING_STEPS_COUNT,
  type OnboardingFormState,
  type EvidenceType,
  getGoalOptions,
} from './onboarding.types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useOnboarding } from '@/features/identity/auth/hooks';

const INITIAL_FORM_STATE: OnboardingFormState = {
  persona: '',
  goal: '',
  yearsExperience: '',
  location: '',
  currentFocus: '',
  targetOutcome: '',
  evidenceTypes: [],
  hasOrganization: null,
  organizationName: '',
};

function toggleEvidenceType(
  selected: EvidenceType[],
  value: EvidenceType,
): EvidenceType[] {
  if (selected.includes(value)) {
    return selected.filter((t) => t !== value);
  }
  return [...selected, value];
}

function clampStep(step: number): number {
  if (step < 1) return 1;
  if (step > ONBOARDING_STEPS_COUNT) return ONBOARDING_STEPS_COUNT;
  return step;
}

export function OnboardingPage({ userId }: { userId: string }) {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingFormState>(INITIAL_FORM_STATE);
  const [submitError, setSubmitError] = useState<string>('');
  const router = useRouter();
  const onboardingMutation = useOnboarding();

  const goalOptions = useMemo(
    () => getGoalOptions(form.persona),
    [form.persona],
  );

  const canProceed = useMemo(() => {
    if (step === 1) return form.persona !== '';
    if (step === 2) return form.goal !== '';
    if (step === 3) return form.yearsExperience !== '';
    if (step === 4) return true;
    if (step === 5) return form.targetOutcome.trim().length > 0;
    if (step === 6) return true;
    if (step === 7) {
      if (form.persona === 'EMPLOYER') {
        return form.hasOrganization !== null;
      }
      return true;
    }
    return true;
  }, [form, step]);

  const handleBack = () => {
    setStep((prev) => clampStep(prev - 1));
  };

  const handleNext = () => {
    if (!canProceed) return;
    setStep((prev) => clampStep(prev + 1));
  };

  const handleSubmit = () => {
    if (!canProceed || onboardingMutation.isPending) return;
    setSubmitError('');

    if (form.persona === '' || form.goal === '' || form.yearsExperience === '') {
      setSubmitError('Please complete the required onboarding fields.');
      return;
    }

    onboardingMutation
      .mutateAsync({
        persona: form.persona,
        goal: form.goal,
        yearsExperience: form.yearsExperience,
        location: form.location.trim() ? form.location : undefined,
        currentFocus: form.currentFocus.trim() ? form.currentFocus : undefined,
        targetOutcome: form.targetOutcome,
        evidenceTypes: form.evidenceTypes.length ? form.evidenceTypes : undefined,
        hasOrganization:
          form.persona === 'EMPLOYER'
            ? (form.hasOrganization ?? undefined)
            : undefined,
        organizationName:
          form.persona === 'EMPLOYER' && form.organizationName.trim()
            ? form.organizationName
            : undefined,
      })
      .then(() => setStep(8))
      .catch((error: unknown) => {
        if (error instanceof Error) {
          setSubmitError(error.message);
          return;
        }
        setSubmitError('Failed to submit onboarding survey. Please try again.');
      });
  };

  const handleFinish = () => {
    if (form.persona === 'EMPLOYER') {
      router.push(`/employer/${userId}/dashboard`);
      return;
    }
    router.push(`/user/${userId}/dashboard`);
  };

  const content = useMemo(() => {
    if (step === 1) {
      return (
        <OnboardingStepOne
          persona={form.persona}
          onChangePersona={(persona) =>
            setForm((prev) => ({
              ...prev,
              persona,
              goal: '',
              hasOrganization: null,
              organizationName: '',
            }))
          }
        />
      );
    }

    if (step === 2) {
      return (
        <OnboardingStepTwo
          persona={form.persona}
          goal={form.goal}
          options={goalOptions}
          onChangeGoal={(goal) => setForm((prev) => ({ ...prev, goal }))}
        />
      );
    }

    if (step === 3) {
      return (
        <OnboardingStepThree
          persona={form.persona}
          yearsExperience={form.yearsExperience}
          currentFocus={form.currentFocus}
          onChangeYearsExperience={(yearsExperience) =>
            setForm((prev) => ({ ...prev, yearsExperience }))
          }
          onChangeCurrentFocus={(currentFocus) =>
            setForm((prev) => ({ ...prev, currentFocus }))
          }
        />
      );
    }

    if (step === 4) {
      return (
        <OnboardingStepFour
          location={form.location}
          onChangeLocation={(location) =>
            setForm((prev) => ({ ...prev, location }))
          }
        />
      );
    }

    if (step === 5) {
      return (
        <OnboardingStepFive
          persona={form.persona}
          targetOutcome={form.targetOutcome}
          onChangeTargetOutcome={(targetOutcome) =>
            setForm((prev) => ({ ...prev, targetOutcome }))
          }
        />
      );
    }

    if (step === 6) {
      return (
        <OnboardingStepSix
          evidenceTypes={form.evidenceTypes}
          onToggleEvidenceType={(value) =>
            setForm((prev) => ({
              ...prev,
              evidenceTypes: toggleEvidenceType(prev.evidenceTypes, value),
            }))
          }
        />
      );
    }

    if (step === 7) {
      return (
        <OnboardingStepSeven
          form={form}
          goalLabel={
            goalOptions.find((opt) => opt.value === form.goal)?.label ?? ''
          }
          onChangeHasOrganization={(hasOrganization) =>
            setForm((prev) => ({ ...prev, hasOrganization }))
          }
          organizationName={form.organizationName}
          onChangeOrganizationName={(organizationName) =>
            setForm((prev) => ({ ...prev, organizationName }))
          }
        />
      );
    }

    return <OnboardingStepEight persona={form.persona} />;
  }, [form, goalOptions, step]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="border-b">
          <CardTitle className="text-xl">Onboarding</CardTitle>
          <CardDescription>
            Step {step} of {ONBOARDING_STEPS_COUNT}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {submitError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                {submitError}
              </AlertDescription>
            </Alert>
          )}
          {content}
          <Separator />
          <div className="text-muted-foreground text-sm">
            You can update these details later in your profile.
          </div>
        </CardContent>

        <CardFooter className="border-t justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 1 || step === 8 || onboardingMutation.isPending}
          >
            Back
          </Button>

          {step < 7 && (
            <Button type="button" onClick={handleNext} disabled={!canProceed}>
              Next
            </Button>
          )}

          {step === 7 && (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canProceed || onboardingMutation.isPending}
            >
              {onboardingMutation.isPending ? 'Submitting…' : 'Submit'}
            </Button>
          )}

          {step === 8 && (
            <Button type="button" onClick={handleFinish}>
              Continue
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
