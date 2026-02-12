import { Badge } from '@/components/ui/badge';
import type { OnboardingPersona } from './onboarding.types';

export function OnboardingStepEight({
  persona,
}: {
  persona: OnboardingPersona | '';
}) {
  const badgeText = persona === 'EMPLOYER' ? 'Employer' : 'User';

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="text-lg font-semibold">You&apos;re all set</div>
        <div className="text-muted-foreground text-sm">
          Your onboarding is complete. Continue to your dashboard.
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="secondary">{badgeText}</Badge>
      </div>
    </div>
  );
}

