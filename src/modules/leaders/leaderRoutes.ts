import { Router } from 'express';
import { LeaderController } from './leaderController';
import { validate } from '@/middlewares/validator';
import {
  createLeaderSchema,
  updateLeaderSchema,
  getLeaderSchema,
  deleteLeaderSchema,
  listLeadersSchema,
} from './leaderSchemas';

const router = Router();

router.post('/', validate(createLeaderSchema), LeaderController.create);
router.get('/', validate(listLeadersSchema), LeaderController.list);
router.get('/:id', validate(getLeaderSchema), LeaderController.getById);
router.put('/:id', validate(updateLeaderSchema), LeaderController.update);
router.delete('/:id', validate(deleteLeaderSchema), LeaderController.delete);
router.get('/:leaderId/link', LeaderController.getDeepLink);

export default router;

