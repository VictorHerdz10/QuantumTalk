import { z } from "zod";

// Esquema para respuesta de error común
export const ErrorResponseSchema = z.object({
  msg: z.string()
});

// Esquema para respuesta de login exitoso
export const LoginResponseSchema = z.object({
  token: z.string()
});

// Esquema para respuesta de autenticación
export const AuthUserSchema = z.object({
 _id: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  info: z.string().nullable().optional(),
  image: z.string().nullable().optional()
});

export const AuthenticateResponseSchema = z.union([
  ErrorResponseSchema,
  AuthUserSchema
]);

// Tipo para respuesta de autenticación
export type AuthenticateResponse = z.infer<typeof AuthenticateResponseSchema>;