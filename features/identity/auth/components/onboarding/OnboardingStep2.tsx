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
import type { OnboardingGoal, OnboardingPersona } from './onboarding.types';

export function OnboardingStepTwo({
  persona,
  goal,
  options,
  onChangeGoal,
}: {
  persona: OnboardingPersona | '';
  goal: OnboardingGoal | '';
  options: Array<{ value: OnboardingGoal; label: string; description: string }>;
  onChangeGoal: (value: OnboardingGoal) => void;
}) {
  const title = persona === 'EMPLOYER' ? 'What do you want to do first?' : 'What is your primary goal?';

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="text-lg font-semibold">{title}</div>
        <div className="text-muted-foreground text-sm">
          We&apos;ll prioritize this in your dashboard and recommendations.
        </div>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel>Primary goal</FieldLabel>
          <FieldContent>
            <Select
              value={goal}
              onValueChange={(value) => onChangeGoal(value as OnboardingGoal)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a goal" />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>
              {options.find((opt) => opt.value === goal)?.description ??
                'Pick one to continue.'}
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  );
}
