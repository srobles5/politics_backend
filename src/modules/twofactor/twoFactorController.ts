import { Request, Response } from 'express';
import { generateTwoFactorCode, saveTwoFactorCode, validateTwoFactorCode } from '@/utils/twoFactor';
import { sendSuccess, sendError } from '@/utils/response';
import dotenv from 'dotenv';

dotenv.config();

export class TwoFactorController {
  static async requestCode(req: Request, res: Response) {
    try {
      const code = generateTwoFactorCode();
      const expiryMinutes = parseInt(process.env.TWO_FACTOR_CODE_EXPIRY_MINUTES || '10', 10);

      await saveTwoFactorCode(code, expiryMinutes);

      // En producción, aquí se enviaría el código por SMS/Email
      // Por ahora, lo logueamos para pruebas
      console.log(`📱 Two Factor Code generated: ${code} (expires in ${expiryMinutes} minutes)`);

      return sendSuccess(
        res,
        {
          message: 'Código generado correctamente. En producción, se enviaría por SMS/Email.',
          // En desarrollo, devolvemos el código. En producción, NO hacer esto
          code: process.env.NODE_ENV === 'development' ? code : undefined,
        },
        'Código 2FA generado'
      );
    } catch (error: any) {
      return sendError(res, error.message || 'Error al generar el código 2FA', 500);
    }
  }

  static async validateCode(req: Request, res: Response) {
    try {
      const { code } = req.body;
      const isValid = await validateTwoFactorCode(code);

      if (!isValid) {
        return sendError(res, 'Código inválido o expirado', 400);
      }

      return sendSuccess(
        res,
        { verified: true },
        'Código verificado correctamente'
      );
    } catch (error: any) {
      return sendError(res, error.message || 'Error al validar el código', 500);
    }
  }
}

