import { z } from 'zod';

export const seedSchema = z.object({
  body: z.object({
    leaderCount: z.number().int().min(1).max(100).optional(),
    votersPerLeader: z.number().int().min(0).max(50).optional(),
  }),
});

export const clearSchema = z.object({
  body: z.object({}).optional(),
});

export const statsSchema = z.object({
  body: z.object({}).optional(),
});

