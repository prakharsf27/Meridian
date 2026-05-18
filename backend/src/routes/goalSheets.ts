import { Router, Response } from 'express';
import { authenticate, requireRole, type AuthRequest } from '../middleware/auth';
import GoalSheet from '../models/GoalSheet';
import Goal from '../models/Goal';
import AuditLog from '../models/AuditLog';
import { z } from 'zod';

export const goalSheetsRouter = Router();
goalSheetsRouter.use(authenticate);

// Get my goal sheet for current cycle
goalSheetsRouter.get('/me', async (req: AuthRequest, res: Response): Promise<void> => {
  const sheets = await GoalSheet.find({ employeeId: req.user!.id })
    .populate('cycleId')
    .sort({ createdAt: -1 });
  res.json(sheets);
});

// Create a new goal sheet
goalSheetsRouter.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const existing = await GoalSheet.findOne({ employeeId: req.user!.id, status: { $in: ['draft', 'submitted'] } });
  if (existing) {
    res.status(409).json({ error: 'You already have an active goal sheet. Complete or withdraw it first.' });
    return;
  }
  const sheet = await GoalSheet.create({ employeeId: req.user!.id, ...req.body });
  res.status(201).json(sheet);
});

// Get sheet by ID
goalSheetsRouter.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const sheet = await GoalSheet.findById(req.params.id).populate('employeeId').populate('approvedBy');
  if (!sheet) { res.status(404).json({ error: 'Not found' }); return; }
  const goals = await Goal.find({ goalSheetId: sheet._id });
  res.json({ sheet, goals });
});

// Submit for approval
goalSheetsRouter.post('/:id/submit', async (req: AuthRequest, res: Response): Promise<void> => {
  const sheet = await GoalSheet.findById(req.params.id);
  if (!sheet) { res.status(404).json({ error: 'Not found' }); return; }
  if (sheet.status !== 'draft' && sheet.status !== 'reopened') {
    res.status(400).json({ error: 'Only draft sheets can be submitted.' }); return;
  }

  const goals = await Goal.find({ goalSheetId: sheet._id });

  // Validate: max 8 goals
  if (goals.length > 8) { res.status(400).json({ error: "You've reached the 8-goal limit." }); return; }

  // Validate: weightage = 100
  const totalWeight = goals.reduce((s, g) => s + g.weightage, 0);
  if (totalWeight !== 100) {
    const diff = 100 - totalWeight;
    res.status(400).json({
      error: diff > 0
        ? `Your total weightage is ${totalWeight}%. Add ${diff}% more to submit.`
        : `Your total weightage is ${totalWeight}%. Remove ${Math.abs(diff)}% to submit.`,
    });
    return;
  }

  // Validate: min 10% per goal
  const lowGoal = goals.find(g => g.weightage < 10);
  if (lowGoal) {
    res.status(400).json({ error: `Goal "${lowGoal.title}" is below the 10% minimum. Adjust before submitting.` });
    return;
  }

  const before = { status: sheet.status };
  sheet.status = 'submitted';
  sheet.submittedAt = new Date();
  await sheet.save();

  await AuditLog.create({
    entityType: 'GoalSheet',
    entityId: sheet._id,
    action: 'SUBMITTED',
    before,
    after: { status: 'submitted' },
    changedBy: req.user!.id,
    changedAt: new Date(),
  });

  res.json(sheet);
});

// Approve (manager/admin)
goalSheetsRouter.post('/:id/approve', authenticate, requireRole('manager', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const sheet = await GoalSheet.findById(req.params.id);
  if (!sheet) { res.status(404).json({ error: 'Not found' }); return; }

  const before = { status: sheet.status };
  sheet.status = 'approved';
  sheet.approvedAt = new Date();
  sheet.approvedBy = req.user!.id as any;
  await sheet.save();

  // Lock all goals
  await Goal.updateMany({ goalSheetId: sheet._id }, { locked: true });

  await AuditLog.create({
    entityType: 'GoalSheet', entityId: sheet._id, action: 'APPROVED',
    before, after: { status: 'approved' },
    changedBy: req.user!.id, changedAt: new Date(),
  });

  res.json(sheet);
});

// Reject / Return
goalSheetsRouter.post('/:id/reject', authenticate, requireRole('manager', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const sheet = await GoalSheet.findById(req.params.id);
  if (!sheet) { res.status(404).json({ error: 'Not found' }); return; }
  const before = { status: sheet.status };
  sheet.status = 'reopened';
  await sheet.save();
  await AuditLog.create({
    entityType: 'GoalSheet', entityId: sheet._id, action: 'RETURNED',
    before, after: { status: 'reopened' },
    changedBy: req.user!.id, changedAt: new Date(),
  });
  res.json(sheet);
});

// Admin unlock
goalSheetsRouter.post('/:id/unlock', authenticate, requireRole('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const sheet = await GoalSheet.findById(req.params.id);
  if (!sheet) { res.status(404).json({ error: 'Not found' }); return; }
  const before = { status: sheet.status };
  sheet.status = 'reopened';
  await sheet.save();
  await Goal.updateMany({ goalSheetId: sheet._id }, { locked: false });
  await AuditLog.create({
    entityType: 'GoalSheet', entityId: sheet._id, action: 'UNLOCKED',
    before, after: { status: 'reopened' },
    changedBy: req.user!.id, changedAt: new Date(),
  });
  res.json({ message: 'Unlocked successfully' });
});
