import { Router, Response } from 'express';
import { authenticate, requireRole, type AuthRequest } from '../middleware/auth';
import User from '../models/User';

export const usersRouter = Router();
usersRouter.use(authenticate);

// Get org tree (admin)
usersRouter.get('/', requireRole('admin'), async (_req: AuthRequest, res: Response): Promise<void> => {
  const users = await User.find({ isActive: true }).select('-passwordHash');
  res.json(users);
});

// Get direct reports (manager)
usersRouter.get('/my-team', requireRole('manager', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const team = await User.find({ managerId: req.user!.id, isActive: true }).select('-passwordHash');
  res.json(team);
});
