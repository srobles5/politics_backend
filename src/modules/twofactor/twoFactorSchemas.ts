import { z } from 'zod';

export const requestTwoFactorSchema = z.object({
  body: z.object({}).optional(),
});

export const validateTwoFactorSchema = z.object({
  body: z.object({
    code: z.string().length(6, 'El código debe tener 6 dígitos').regex(/^\d{6}$/, 'El código debe contener solo números'),
  }),
});

