import { LucideIcon } from 'lucide-react';

export interface SubNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  description?: string;
}

export interface SubNavGroup {
  type: 'group';
  key: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  children: SubNavItem[];
}

export type SubNavEntry = SubNavItem | SubNavGroup;

export interface NavModule {
  key: string;
  label: string;
  icon: LucideIcon;
  match: string;
  to: string;
  description: string;
  color: string;
  children?: SubNavEntry[];
}

export const SubNavItem = class {};
export const SubNavGroup = class {};
export const NavModule = class {};
