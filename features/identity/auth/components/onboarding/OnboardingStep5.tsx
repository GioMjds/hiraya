import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import type { OnboardingPersona } from './onboarding.types';

export function OnboardingStepFive({
  persona,
  targetOutcome,
  onChangeTargetOutcome,
}: {
  persona: OnboardingPersona | '';
  targetOutcome: string;
  onChangeTargetOutcome: (value: string) => void;
}) {
  const label = persona === 'EMPLOYER' ? 'What roles do you hire for?' : 'What do you want to be matched to?';
  const placeholder =
    persona === 'EMPLOYER'
      ? 'e.g., Junior backend developer, data analyst'
      : 'e.g., Entry-level frontend roles, internship postings';

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="text-lg font-semibold">Target outcome</div>
        <div className="text-muted-foreground text-sm">
          This stays domain-agnostic for the MVP but guides recommendations.
        </div>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel>{label}</FieldLabel>
          <FieldContent>
            <Textarea
              value={targetOutcome}
              onChange={(e) => onChangeTargetOutcome(e.target.value)}
              placeholder={placeholder}
              rows={4}
            />
            <FieldDescription>
              Short description is enough. You can refine later.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  );
}

