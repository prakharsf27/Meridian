import cron from 'node-cron';
import GoalSheet from '../models/GoalSheet';
import CheckIn from '../models/CheckIn';
import User from '../models/User';
import AuditLog from '../models/AuditLog';

export interface EscalationEvent {
  rule: string;
  severity: 'high' | 'medium' | 'low';
  employeeId: string;
  detail: string;
  triggeredAt: Date;
}

const in_memory_escalations: EscalationEvent[] = [];

export function getEscalations() {
  return in_memory_escalations;
}

async function runEscalationRules() {
  console.log('🔄 Running escalation rules...');
  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const fiveDaysAgo  = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

  // Rule 1: Goal sheet not submitted 5+ days into cycle
  const employees = await User.find({ role: 'employee', isActive: true });
  for (const emp of employees) {
    const sheet = await GoalSheet.findOne({ employeeId: emp._id }).sort({ createdAt: -1 });
    if (!sheet || sheet.status === 'draft') {
      const createdAt = sheet?.createdAt ?? now;
      if (createdAt <= fiveDaysAgo) {
        in_memory_escalations.push({
          rule: 'Goal sheet not submitted',
          severity: 'medium',
          employeeId: emp._id.toString(),
          detail: `${emp.name} (${emp.employeeCode}) hasn't submitted their goal sheet.`,
          triggeredAt: now,
        });
        await AuditLog.create({
          entityType: 'GoalSheet', entityId: emp._id, action: 'ESCALATED',
          before: null,
          after: { rule: 'Rule #1 — submission overdue' },
          changedBy: emp._id, changedAt: now,
        });
      }
    }
  }

  // Rule 2: Manager hasn't approved 3+ days after submission
  const pendingSheets = await GoalSheet.find({ status: 'submitted', submittedAt: { $lte: threeDaysAgo } });
  for (const sheet of pendingSheets) {
    in_memory_escalations.push({
      rule: 'Manager approval overdue',
      severity: 'high',
      employeeId: sheet.employeeId.toString(),
      detail: `Sheet submitted ${Math.floor((now.getTime() - (sheet.submittedAt?.getTime() ?? 0)) / 86400000)}d ago. No manager action.`,
      triggeredAt: now,
    });
  }

  // Rule 3: Check-in window open, no check-in logged
  const approvedSheets = await GoalSheet.find({ status: 'approved' });
  for (const sheet of approvedSheets) {
    const q2CheckIn = await CheckIn.findOne({ goalSheetId: sheet._id, quarter: 'Q2' });
    if (!q2CheckIn) {
      in_memory_escalations.push({
        rule: 'Q2 check-in not submitted',
        severity: 'medium',
        employeeId: sheet.employeeId.toString(),
        detail: 'Q2 check-in window is open. No entry logged.',
        triggeredAt: now,
      });
    }
  }

  console.log(`✅ Escalation run complete. ${in_memory_escalations.length} active escalations.`);
}

export function startEscalationCron() {
  // Run daily at midnight
  cron.schedule('0 0 * * *', runEscalationRules);
  // Also run immediately on startup in dev
  if (process.env.NODE_ENV !== 'production') {
    setTimeout(runEscalationRules, 3000);
  }
  console.log('🕐 Escalation cron scheduled (daily at midnight)');
}
