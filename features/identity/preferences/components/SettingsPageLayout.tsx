'use client';

import { ReactNode } from 'react';

interface SettingsPageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsPageLayout({ title, description, children }: SettingsPageLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}
