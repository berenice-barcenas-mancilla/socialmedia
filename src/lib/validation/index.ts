import * as z from "zod";

// ============================================================
// USER
// ============================================================
export const SignupValidation = z.object({
  name: z.string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .refine(val => val.trim().length > 1, { message: "El nombre no puede estar vacío ni contener solo espacios." })
    .refine(val => !/\s/.test(val), { message: "El nombre no debe contener espacios." }),
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
    .refine(val => val.trim().length > 1, { message: "El nombre no puede estar vacío ni contener solo espacios." })
    .refine(val => !/\s/.test(val), { message: "El nombre no debe contener espacios." }),
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
    .min(5, { message: "Minimum 5 characters." })
    .max(2200, { message: "Maximum 2,200 characters" }),
  file: z.custom<File[]>(),
  location: z.string()
    .min(1, { message: "This field is required" })
    .max(1000, { message: "Maximum 1000 characters." }),
  tags: z.string(),
});
