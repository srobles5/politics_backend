import { Router } from 'express';
import { VoterController } from './voterController';
import { validate } from '@/middlewares/validator';
import {
  createVoterSchema,
  updateVoterSchema,
  getVoterSchema,
  deleteVoterSchema,
  listVotersSchema,
} from './voterSchemas';

const router = Router();

router.post('/', validate(createVoterSchema), VoterController.create);
router.get('/leader/:leaderId', validate(listVotersSchema), VoterController.listByLeader);
router.get('/:id', validate(getVoterSchema), VoterController.getById);
router.put('/:id', validate(updateVoterSchema), VoterController.update);
router.delete('/:id', validate(deleteVoterSchema), VoterController.delete);

export default router;

