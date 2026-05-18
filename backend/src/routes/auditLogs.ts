import { Router, Response } from 'express';
import { authenticate, requireRole, type AuthRequest } from '../middleware/auth';
import AuditLog from '../models/AuditLog';

export const auditLogsRouter = Router();
auditLogsRouter.use(authenticate, requireRole('admin'));

auditLogsRouter.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const { entityType, action, page = '1', limit = '50' } = req.query as Record<string, string>;
  const filter: Record<string, any> = {};
  if (entityType) filter.entityType = entityType;
  if (action) filter.action = action;

  const logs = await AuditLog.find(filter)
    .populate('changedBy', 'name email role')
    .sort({ changedAt: -1 })
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit));

  const total = await AuditLog.countDocuments(filter);
  res.json({ logs, total, page: parseInt(page), limit: parseInt(limit) });
});
