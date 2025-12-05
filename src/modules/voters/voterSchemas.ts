import { z } from 'zod';

export const createVoterSchema = z.object({
  body: z.object({
    leaderId: z.string().uuid('ID de líder inválido'),
    municipio: z.string().min(1, 'El municipio es requerido'),
    barrio: z.string().min(1, 'El barrio es requerido'),
    nombres: z.string().min(1, 'Los nombres son requeridos'),
    apellidos: z.string().min(1, 'Los apellidos son requeridos'),
    cedula: z.string().regex(/^\d{7,11}$/, 'La cédula debe tener entre 7 y 11 dígitos'),
    email: z.string().email('Email inválido'),
    celular: z.string().regex(/^3\d{9}$/, 'El celular debe tener 10 dígitos y empezar con 3'),
    fechaNacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (YYYY-MM-DD)'),
    funcionCargo: z.string().min(1, 'La función/cargo es requerida'),
    profesion: z.string().min(1, 'La profesión es requerida'),
  }),
});

export const updateVoterSchema = z.object({
  body: z.object({
    municipio: z.string().min(1).optional(),
    barrio: z.string().min(1).optional(),
    nombres: z.string().min(1).optional(),
    apellidos: z.string().min(1).optional(),
    cedula: z.string().regex(/^\d{7,11}$/).optional(),
    email: z.string().email().optional(),
    celular: z.string().regex(/^3\d{9}$/).optional(),
    fechaNacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    funcionCargo: z.string().min(1).optional(),
    profesion: z.string().min(1).optional(),
  }),
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});

export const getVoterSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});

export const deleteVoterSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});

export const listVotersSchema = z.object({
  params: z.object({
    leaderId: z.string().uuid('ID de líder inválido'),
  }),
});

