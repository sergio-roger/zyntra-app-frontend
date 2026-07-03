import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .max(80, "Máximo 80 caracteres")
    .optional()
    .or(z.literal("")),
  lastName: z
    .string()
    .max(80, "Máximo 80 caracteres")
    .optional()
    .or(z.literal("")),
  jobTitle: z
    .string()
    .max(120, "Máximo 120 caracteres")
    .optional()
    .or(z.literal("")),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe incluir al menos una mayúscula")
      .regex(/[0-9]/, "Debe incluir al menos un número"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
