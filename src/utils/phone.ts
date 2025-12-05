/**
 * Formatea un número de celular al formato XXX XXX XXXX
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Limpia el formato del número de teléfono
 */
export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

/**
 * Valida que el celular tenga el formato correcto (3XXXXXXXXX)
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const cleaned = cleanPhoneNumber(phone);
  return cleaned.length === 10 && cleaned.startsWith('3');
};

