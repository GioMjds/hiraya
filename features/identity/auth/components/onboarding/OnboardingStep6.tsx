import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Toggle } from '@/components/ui/toggle';
import {
  EVIDENCE_TYPE_OPTIONS,
  type EvidenceType,
} from './onboarding.types';

export function OnboardingStepSix({
  evidenceTypes,
  onToggleEvidenceType,
}: {
  evidenceTypes: EvidenceType[];
  onToggleEvidenceType: (value: EvidenceType) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="text-lg font-semibold">Evidence you can provide (optional)</div>
        <div className="text-muted-foreground text-sm">
          Hiraya supports evidence-backed validation to increase matching reliability.
        </div>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel>Evidence types</FieldLabel>
          <FieldContent>
            <div className="flex flex-wrap gap-2">
              {EVIDENCE_TYPE_OPTIONS.map((opt) => (
                <Toggle
                  key={opt.value}
                  variant="outline"
                  pressed={evidenceTypes.includes(opt.value)}
                  onPressedChange={() => onToggleEvidenceType(opt.value)}
                >
                  {opt.label}
                </Toggle>
              ))}
            </div>
            <FieldDescription>
              You can add evidence later when you declare skills.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  );
}

