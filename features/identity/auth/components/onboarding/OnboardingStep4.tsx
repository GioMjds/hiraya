import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function OnboardingStepFour({
  location,
  onChangeLocation,
}: {
  location: string;
  onChangeLocation: (value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="text-lg font-semibold">Location (optional)</div>
        <div className="text-muted-foreground text-sm">
          Helps with role context and org setup. You can skip this for now.
        </div>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel>Location</FieldLabel>
          <FieldContent>
            <Input
              value={location}
              onChange={(e) => onChangeLocation(e.target.value)}
              placeholder="e.g., Manila, PH"
            />
            <FieldDescription>
              City, country, or remote.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  );
}
