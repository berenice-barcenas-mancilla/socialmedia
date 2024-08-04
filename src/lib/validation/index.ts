import * as z from "zod";

// ============================================================
// USER
// ============================================================
export const SignupValidation = z.object({
  name: z.string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .refine(val => val.trim().length > 1, { message: "El nombre no puede estar vacío ni contener solo espacios." }),
  username: z.string()
    .min(2, { message: "El nombre de usuario debe tener al menos 2 caracteres." })
    .refine(val => val.trim().length > 1, { message: "El nombre de usuario no puede estar vacío ni contener solo espacios." })
    .refine(val => !/\s/.test(val), { message: "El nombre de usuario no debe contener espacios." }),
  email: z.string().email(),
  password: z.string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .refine(val => val.trim().length > 7, { message: "La contraseña no puede estar vacía ni contener solo espacios." })
    .refine(val => !/\s/.test(val), { message: "La contraseña no debe contener espacios." }),
});

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .refine(val => val.trim().length > 7, { message: "La contraseña no puede estar vacía ni contener solo espacios." })
    .refine(val => !/\s/.test(val), { message: "La contraseña no debe contener espacios." }),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .refine(val => val.trim().length > 1, { message: "El nombre no puede estar vacío ni contener solo espacios." }),
  username: z.string()
    .min(2, { message: "El nombre de usuario debe tener al menos 2 caracteres." })
    .refine(val => val.trim().length > 1, { message: "El nombre de usuario no puede estar vacío ni contener solo espacios." })
    .refine(val => !/\s/.test(val), { message: "El nombre de usuario no debe contener espacios." }),
  email: z.string().email(),
  bio: z.string(),
});

// ============================================================
// POST
// ============================================================
export const PostValidation = z.object({
  caption: z.string()
    .min(5, { message: "Mínimo 5 caracteres." })
    .max(2200, { message: "Máximo 2.200 caracteres" }),
  description: z.string().min(1, "Descripción es requerida"),  // Agrega esta validación
  file: z.custom<File[]>(),
});
