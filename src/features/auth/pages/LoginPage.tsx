import React from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { AuthLayout } from "@features/auth/components/AuthLayout";
import { LoginForm } from "@features/auth/components/LoginForm";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout
      icon={<LogIn className="text-white" size={32} />}
      title="Bienvenido"
      subtitle="Ingresa a tu panel de Zyntra"
    >
      <LoginForm onSuccess={() => navigate("/dashboard")} />
    </AuthLayout>
  );
};
