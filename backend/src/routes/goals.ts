import { Router, Response } from 'express';
import { authenticate, requireRole, type AuthRequest } from '../middleware/auth';
import Goal from '../models/Goal';
import GoalSheet from '../models/GoalSheet';
import AuditLog from '../models/AuditLog';

export const goalsRouter = Router();
goalsRouter.use(authenticate);

// Add goal to sheet
goalsRouter.post('/sheet/:sheetId', async (req: AuthRequest, res: Response): Promise<void> => {
  const sheet = await GoalSheet.findById(req.params.sheetId);
  if (!sheet) { res.status(404).json({ error: 'Goal sheet not found' }); return; }

  const count = await Goal.countDocuments({ goalSheetId: sheet._id });
  if (count >= 8) {
    res.status(400).json({ error: "You've reached the 8-goal limit. Remove a goal to add a new one." });
    return;
  }
  if (req.body.weightage < 10) {
    res.status(400).json({ error: `Goal "${req.body.title}" is below the 10% minimum. Adjust before submitting.` });
    return;
  }

  const goal = await Goal.create({ goalSheetId: sheet._id, ...req.body });
  res.status(201).json(goal);
});

// Update goal (checks lock)
goalsRouter.put('/:goalId', async (req: AuthRequest, res: Response): Promise<void> => {
  const goal = await Goal.findById(req.params.goalId);
  if (!goal) { res.status(404).json({ error: 'Goal not found' }); return; }
  if (goal.locked && req.user!.role !== 'admin') {
    res.status(403).json({ error: 'This goal is locked. Request an unlock from Admin to modify it.' });
    return;
  }
  const before = goal.toObject();
  Object.assign(goal, req.body);
  await goal.save();
  await AuditLog.create({
    entityType: 'Goal', entityId: goal._id, action: 'UPDATED',
    before, after: goal.toObject(),
    changedBy: req.user!.id, changedAt: new Date(),
  });
  res.json(goal);
});

// Delete goal
goalsRouter.delete('/:goalId', async (req: AuthRequest, res: Response): Promise<void> => {
  const goal = await Goal.findById(req.params.goalId);
  if (!goal) { res.status(404).json({ error: 'Goal not found' }); return; }
  if (goal.locked) {
    res.status(403).json({ error: 'Cannot delete a locked goal. Request unlock from Admin.' });
    return;
  }
  await goal.deleteOne();
  res.json({ message: 'Goal deleted' });
});
