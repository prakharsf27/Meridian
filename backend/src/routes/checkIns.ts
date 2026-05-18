import { Router, Response } from 'express';
import { authenticate, requireRole, type AuthRequest } from '../middleware/auth';
import CheckIn from '../models/CheckIn';
import AuditLog from '../models/AuditLog';

export const checkInsRouter = Router();
checkInsRouter.use(authenticate);

checkInsRouter.get('/sheet/:sheetId', async (req: AuthRequest, res: Response): Promise<void> => {
  const checkins = await CheckIn.find({ goalSheetId: req.params.sheetId }).sort({ capturedAt: -1 });
  res.json(checkins);
});

checkInsRouter.post('/sheet/:sheetId', async (req: AuthRequest, res: Response): Promise<void> => {
  const checkin = await CheckIn.create({
    goalSheetId: req.params.sheetId,
    capturedBy: req.user!.id,
    capturedAt: new Date(),
    ...req.body,
  });
  await AuditLog.create({
    entityType: 'CheckIn', entityId: checkin._id, action: 'CREATED',
    before: null, after: { quarter: checkin.quarter },
    changedBy: req.user!.id, changedAt: new Date(),
  });
  res.status(201).json(checkin);
});

// Manager adds comment
checkInsRouter.patch('/:id/comment', requireRole('manager', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const checkin = await CheckIn.findByIdAndUpdate(
    req.params.id,
    { managerComment: req.body.comment },
    { new: true }
  );
  if (!checkin) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(checkin);
});
