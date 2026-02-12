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
import { PERSONA_OPTIONS, type OnboardingPersona } from './onboarding.types';

export function OnboardingStepOne({
  persona,
  onChangePersona,
}: {
  persona: OnboardingPersona | '';
  onChangePersona: (value: OnboardingPersona) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="text-lg font-semibold">Tell us who you are</div>
        <div className="text-muted-foreground text-sm">
          This helps Hiraya tailor the experience after email verification.
        </div>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel>I&apos;m here as</FieldLabel>
          <FieldContent>
            <Select
              value={persona}
              onValueChange={(value) => onChangePersona(value as OnboardingPersona)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your persona" />
              </SelectTrigger>
              <SelectContent>
                {PERSONA_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>
              You&apos;ll still be able to explore the platform, but onboarding is tuned to
              your main use.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  );
}
