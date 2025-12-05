import { Request, Response, NextFunction } from 'express';
import { query } from '@/config/database';
import { sendError } from '@/utils/response';

export interface TwoFactorRequest extends Request {
  twoFactorVerified?: boolean;
}

/**
 * Middleware para verificar que el usuario haya completado Two Factor
 */
export const verifyTwoFactor = async (
  req: TwoFactorRequest,
  res: Response,
  next: NextFunction
) => {
  // En producción, esto verificaría una sesión o token
  // Por ahora, verificamos si hay un código 2FA verificado recientemente
  const twoFactorHeader = req.headers['x-two-factor-verified'];

  if (twoFactorHeader === 'true') {
    req.twoFactorVerified = true;
    return next();
  }

  // Verificar si hay un código verificado en los últimos 30 minutos
  const result = await query(
    'SELECT * FROM two_factor_codes WHERE verified = TRUE AND expires_at > NOW() - INTERVAL \'30 minutes\' ORDER BY created_at DESC LIMIT 1'
  );

  if (result.rows.length > 0) {
    req.twoFactorVerified = true;
    return next();
  }

  return sendError(res, 'Two Factor Authentication required', 403);
};

