import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Badge } from '@/components/ui/badge';
import {
  PERSONA_OPTIONS,
  type OnboardingFormState,
} from './onboarding.types';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export function OnboardingStepSeven({
  form,
  goalLabel,
  onChangeHasOrganization,
  organizationName,
  onChangeOrganizationName,
}: {
  form: OnboardingFormState;
  goalLabel: string;
  onChangeHasOrganization: (value: boolean) => void;
  organizationName: string;
  onChangeOrganizationName: (value: string) => void;
}) {
  const personaLabel =
    PERSONA_OPTIONS.find((opt) => opt.value === form.persona)?.label ?? '';

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="text-lg font-semibold">Review</div>
        <div className="text-muted-foreground text-sm">
          Confirm your answers before submitting.
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {personaLabel && <Badge variant="secondary">{personaLabel}</Badge>}
        {goalLabel && <Badge variant="secondary">{goalLabel}</Badge>}
        {form.yearsExperience && (
          <Badge variant="secondary">{form.yearsExperience} yrs</Badge>
        )}
        {form.location.trim().length > 0 && (
          <Badge variant="secondary">{form.location.trim()}</Badge>
        )}
      </div>

      <div className="grid gap-4">
        <div>
          <div className="text-sm font-medium">Current focus</div>
          <div className="text-muted-foreground text-sm">
            {form.currentFocus.trim().length > 0
              ? form.currentFocus.trim()
              : 'Not provided'}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium">Target outcome</div>
          <div className="text-muted-foreground text-sm">
            {form.targetOutcome.trim()}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium">Evidence types</div>
          <div className="text-muted-foreground text-sm">
            {form.evidenceTypes.length > 0
              ? form.evidenceTypes.join(', ')
              : 'Not selected'}
          </div>
        </div>
      </div>

      {form.persona === 'EMPLOYER' && (
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldLabel>Do you already have an organization?</FieldLabel>
            <FieldContent>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.hasOrganization === true}
                  onCheckedChange={(checked) => onChangeHasOrganization(checked)}
                />
                <div className="text-muted-foreground text-sm">
                  {form.hasOrganization === true ? 'Yes' : 'No'}
                </div>
              </div>
              <FieldDescription>
                This helps Hiraya decide what to show first for employer setup.
              </FieldDescription>
            </FieldContent>
          </Field>

          {form.hasOrganization === true && (
            <Field>
              <FieldLabel>Organization name (optional)</FieldLabel>
              <FieldContent>
                <Input
                  value={organizationName}
                  onChange={(e) => onChangeOrganizationName(e.target.value)}
                  placeholder="e.g., Hiraya Labs"
                />
              </FieldContent>
            </Field>
          )}
        </FieldGroup>
      )}
    </div>
  );
}

