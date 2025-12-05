import axios from 'axios';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
const GEOCODING_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

export interface GeocodingResult {
  address: string;
  latitude: number;
  longitude: number;
  formattedAddress?: string;
}

export interface ReverseGeocodingResult {
  address: string;
  formattedAddress: string;
}

/**
 * Convierte una dirección en coordenadas (geocodificación)
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY no está configurada');
  }

  try {
    const response = await axios.get(GEOCODING_API_URL, {
      params: {
        address: `${address}, Magdalena, Colombia`,
        key: GOOGLE_MAPS_API_KEY,
        region: 'co',
        components: 'country:CO|administrative_area:Magdalena',
      },
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const result = response.data.results[0];
      const location = result.geometry.location;

      return {
        address: result.formatted_address,
        latitude: location.lat,
        longitude: location.lng,
        formattedAddress: result.formatted_address,
      };
    }

    return null;
  } catch (error: any) {
    console.error('Error en geocodificación:', error);
    throw new Error(`Error al geocodificar dirección: ${error.message}`);
  }
}

/**
 * Convierte coordenadas en una dirección (geocodificación inversa)
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<ReverseGeocodingResult | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY no está configurada');
  }

  try {
    const response = await axios.get(GEOCODING_API_URL, {
      params: {
        latlng: `${latitude},${longitude}`,
        key: GOOGLE_MAPS_API_KEY,
        region: 'co',
        language: 'es',
      },
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const result = response.data.results[0];

      return {
        address: result.formatted_address,
        formattedAddress: result.formatted_address,
      };
    }

    return null;
  } catch (error: any) {
    console.error('Error en geocodificación inversa:', error);
    throw new Error(`Error al obtener dirección: ${error.message}`);
  }
}

