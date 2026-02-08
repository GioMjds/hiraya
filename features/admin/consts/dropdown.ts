import { LucideIcon, Settings, User } from "lucide-react";

export type DropdownItem = {
  id: string;
  label: string;
  icon?: LucideIcon;
  destructive?: boolean;
};

export const PROFILE_DROPDOWN_ITEMS: DropdownItem[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const LANGUAGE_DROPDOWN_ITEMS: DropdownItem[] = [
  { id: 'en', label: 'English' },
  { id: 'fil', label: 'Filipino' },
];