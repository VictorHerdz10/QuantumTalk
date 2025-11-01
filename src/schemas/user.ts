import { z } from 'zod';



export const UserSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().nullable().optional(),
  info: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});


export const UserUpdateSchema = UserSchema.pick({
  name: true,
  phone: true,
  info: true,
  image: true
}).partial();