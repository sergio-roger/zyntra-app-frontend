import { RouteObject } from 'react-router-dom';
import { PublicOnlyRoute } from '@core/routes/ProtectedRoute';
import { LoginPage } from '@features/auth/pages/LoginPage';
import { RegisterPage } from '@features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '@features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@features/auth/pages/ResetPasswordPage';

export const authRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <PublicOnlyRoute><LoginPage /></PublicOnlyRoute>
  },
  {
    path: '/register',
    element: <PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>
  },
  {
    path: '/forgot-password',
    element: <PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>
  },
  {
    path: '/reset-password',
    element: <PublicOnlyRoute><ResetPasswordPage /></PublicOnlyRoute>
  }
];
