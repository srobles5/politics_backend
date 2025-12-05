import { Router } from 'express';
import { GeocodingController } from './geocodingController';

const router = Router();

router.get('/geocode', GeocodingController.geocode);
router.get('/reverse', GeocodingController.reverse);

export default router;

