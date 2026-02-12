import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  type OnboardingPersona,
  type YearsExperience,
  YEARS_EXPERIENCE_OPTIONS,
} from './onboarding.types';

export function OnboardingStepThree({
  persona,
  yearsExperience,
  currentFocus,
  onChangeYearsExperience,
  onChangeCurrentFocus,
}: {
  persona: OnboardingPersona | '';
  yearsExperience: YearsExperience | '';
  currentFocus: string;
  onChangeYearsExperience: (value: YearsExperience) => void;
  onChangeCurrentFocus: (value: string) => void;
}) {
  const focusLabel =
    persona === 'STUDENT'
      ? 'Field of study / program'
      : persona === 'EMPLOYER'
        ? 'Hiring domain'
        : 'Current focus';

  const focusPlaceholder =
    persona === 'STUDENT'
      ? 'e.g., BS Computer Science'
      : persona === 'EMPLOYER'
        ? 'e.g., Software engineering roles'
        : 'e.g., Frontend development';

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="text-lg font-semibold">Background</div>
        <div className="text-muted-foreground text-sm">
          This gives the matching system context for recommendations.
        </div>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel>Years of experience</FieldLabel>
          <FieldContent>
            <Select
              value={yearsExperience}
              onValueChange={(value) =>
                onChangeYearsExperience(value as YearsExperience)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                {YEARS_EXPERIENCE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>
              You can refine proficiency later when you add skills.
            </FieldDescription>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{focusLabel}</FieldLabel>
          <FieldContent>
            <Input
              value={currentFocus}
              onChange={(e) => onChangeCurrentFocus(e.target.value)}
              placeholder={focusPlaceholder}
            />
            <FieldDescription>
              Keep it short. This is used only for onboarding context.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  );
}

