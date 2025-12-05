import { Router } from 'express';
import { TwoFactorController } from './twoFactorController';
import { validate } from '@/middlewares/validator';
import { requestTwoFactorSchema, validateTwoFactorSchema } from './twoFactorSchemas';
import rateLimit from 'express-rate-limit';

// Rate limiting para Two Factor (máximo 5 intentos por 15 minutos)
const twoFactorRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: 'Demasiados intentos. Por favor intenta más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

router.post('/request', validate(requestTwoFactorSchema), twoFactorRateLimit, TwoFactorController.requestCode);
router.post('/validate', validate(validateTwoFactorSchema), twoFactorRateLimit, TwoFactorController.validateCode);

export default router;

