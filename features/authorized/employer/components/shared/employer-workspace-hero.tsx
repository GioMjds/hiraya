import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface EmployerWorkspaceHeroBadge {
  label: string;
  value: string | number;
  variant?: 'outline' | 'secondary';
}

interface EmployerWorkspaceHeroProps {
  title: string;
  description: string;
  actions?: ReactNode;
  badges?: EmployerWorkspaceHeroBadge[];
}

export function EmployerWorkspaceHero({
  title,
  description,
  actions,
  badges,
}: EmployerWorkspaceHeroProps) {
  return (
    <Card className="border-border/80 bg-gradient-to-br from-card via-accent/20 to-background">
      <CardContent className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
        {badges?.length ? (
          <div className="flex flex-wrap items-center gap-2">
            {badges.map((badge) => (
              <Badge
                key={`${badge.label}-${badge.value}`}
                variant={badge.variant ?? 'secondary'}
              >
                {badge.label}: {badge.value}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
