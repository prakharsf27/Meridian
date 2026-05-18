import { Router, Response } from 'express';
import { authenticate, requireRole, type AuthRequest } from '../middleware/auth';
import Cycle from '../models/Cycle';

export const cyclesRouter = Router();
cyclesRouter.use(authenticate);

cyclesRouter.get('/', async (_req: AuthRequest, res: Response): Promise<void> => {
  const cycles = await Cycle.find().sort({ createdAt: -1 });
  res.json(cycles);
});

cyclesRouter.get('/active', async (_req: AuthRequest, res: Response): Promise<void> => {
  const cycle = await Cycle.findOne({ isActive: true });
  res.json(cycle);
});

cyclesRouter.put('/:id', requireRole('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const cycle = await Cycle.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!cycle) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(cycle);
});
