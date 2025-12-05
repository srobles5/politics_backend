import { query } from '@/config/database';

/**
 * Genera un código de 6 dígitos para Two Factor Authentication
 */
export const generateTwoFactorCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Guarda un código 2FA en la base de datos
 */
export const saveTwoFactorCode = async (code: string, expiryMinutes: number = 10): Promise<void> => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);

  await query(
    'INSERT INTO two_factor_codes (code, expires_at) VALUES ($1, $2)',
    [code, expiresAt]
  );
};

/**
 * Valida un código 2FA
 */
export const validateTwoFactorCode = async (code: string): Promise<boolean> => {
  // Limpiar códigos expirados
  await query('DELETE FROM two_factor_codes WHERE expires_at < NOW()');

  const result = await query(
    'SELECT * FROM two_factor_codes WHERE code = $1 AND verified = FALSE AND expires_at > NOW()',
    [code]
  );

  if (result.rows.length === 0) {
    return false;
  }

  // Marcar como verificado
  await query(
    'UPDATE two_factor_codes SET verified = TRUE WHERE code = $1',
    [code]
  );

  return true;
};

