import { Router } from 'express';
import { SeedController } from './seedController';
import { validate } from '@/middlewares/validator';
import { seedSchema, clearSchema, statsSchema } from './seedSchemas';

const router = Router();

// Endpoint para generar datos de prueba
router.post('/seed', validate(seedSchema), SeedController.seed);

// Endpoint para limpiar la base de datos
router.post('/clear', validate(clearSchema), SeedController.clear);

// Endpoint para obtener estadísticas
router.get('/stats', validate(statsSchema), SeedController.stats);

export default router;

