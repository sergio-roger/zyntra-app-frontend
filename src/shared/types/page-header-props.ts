import { ReactNode } from 'react';

export interface PageHeaderProps {
  actions?: ReactNode;
  badge?: ReactNode;
  children?: ReactNode;
  subtitle?: ReactNode;
  title: string;
}
