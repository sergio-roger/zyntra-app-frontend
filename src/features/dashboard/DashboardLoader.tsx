import { lazy } from 'react';
import { FullScreenLoader } from '@shared/components/FullScreenLoader';

export const DashboardFallback = () => <FullScreenLoader />;

export const DashboardLoader = lazy(() => import('./Dashboard'));
