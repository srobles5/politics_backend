import { Request, Response } from 'express';
import { geocodeAddress, reverseGeocode } from '@/services/geocoding';
import { sendSuccess, sendError } from '@/utils/response';

export class GeocodingController {
  static async geocode(req: Request, res: Response) {
    try {
      const { address } = req.query;

      if (!address || typeof address !== 'string') {
        return sendError(res, 'La dirección es requerida', 400);
      }

      const result = await geocodeAddress(address);

      if (!result) {
        return sendError(res, 'No se pudo encontrar la ubicación', 404);
      }

      return sendSuccess(res, result, 'Dirección geocodificada correctamente');
    } catch (error: any) {
      return sendError(res, error.message || 'Error al geocodificar la dirección', 500);
    }
  }

  static async reverse(req: Request, res: Response) {
    try {
      const { lat, lng } = req.query;

      if (!lat || !lng) {
        return sendError(res, 'Las coordenadas (lat, lng) son requeridas', 400);
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lng as string);

      if (isNaN(latitude) || isNaN(longitude)) {
        return sendError(res, 'Las coordenadas deben ser números válidos', 400);
      }

      const result = await reverseGeocode(latitude, longitude);

      if (!result) {
        return sendError(res, 'No se pudo obtener la dirección', 404);
      }

      return sendSuccess(res, result, 'Dirección obtenida correctamente');
    } catch (error: any) {
      return sendError(res, error.message || 'Error al obtener la dirección', 500);
    }
  }
}

