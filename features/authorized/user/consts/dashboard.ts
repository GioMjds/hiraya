import type { Route } from "next";
import { FolderCheck, Sparkles, Target, User } from "lucide-react";

export const QUICK_ACTIONS = [
  {
    title: 'Update profile',
    description: 'Headline, summary, and onboarding goal.',
    icon: User,
    href: (userID: string) => `/user/${userID}/profile` as Route,
  },
  {
    title: 'Manage skills',
    description: 'Add skills and set proficiency.',
    icon: Sparkles,
    href: (userID: string) => `/user/${userID}/skills` as Route,
  },
  {
    title: 'Add evidence',
    description: 'Attach artifacts that validate claims.',
    icon: FolderCheck,
    href: (userID: string) => `/user/${userID}/evidence` as Route,
  },
  {
    title: 'View matches',
    description: 'See your fit score per role.',
    icon: Target,
    href: (userID: string) => `/user/${userID}/matches` as Route,
  },
];