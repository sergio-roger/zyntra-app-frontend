import { LucideIcon } from 'lucide-react';

export interface SubNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  description?: string;
}

export interface NavModule {
  key: string;
  label: string;
  icon: LucideIcon;
  match: string;
  to: string;
  description: string;
  color: string;
  children?: SubNavItem[];
}

export const SubNavItem = class {};
export const NavModule = class {};
