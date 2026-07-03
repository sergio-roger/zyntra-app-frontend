import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { AuthLayout } from "@features/auth/components/AuthLayout";
import { RegisterForm } from "@features/auth/components/RegisterForm";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout
      icon={<UserPlus className="text-white" size={32} />}
      title="Crea tu cuenta"
      subtitle="Empieza tu prueba gratuita de 14 días"
      footer={
        <>
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Inicia sesión
          </Link>
        </>
      }
    >
      <RegisterForm onSuccess={() => navigate("/dashboard")} />
    </AuthLayout>
  );
};
