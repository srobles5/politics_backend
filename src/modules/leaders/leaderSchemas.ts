import { z } from 'zod';

export const createLeaderSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    municipio: z.string().min(1, 'El municipio es requerido'),
    empresaAsociacion: z.string().min(1, 'La empresa/asociación es requerida'),
    celular: z.string().regex(/^3\d{9}$/, 'El celular debe tener 10 dígitos y empezar con 3'),
    cedula: z.string().regex(/^\d{7,11}$/, 'La cédula debe tener entre 7 y 11 dígitos'),
  }),
});

export const updateLeaderSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    municipio: z.string().min(1).optional(),
    empresaAsociacion: z.string().min(1).optional(),
    celular: z.string().regex(/^3\d{9}$/).optional(),
    cedula: z.string().regex(/^\d{7,11}$/).optional(),
  }),
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});

export const getLeaderSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});

export const deleteLeaderSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});

export const listLeadersSchema = z.object({
  query: z.object({
    sortBy: z.enum(['name', 'voters']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

