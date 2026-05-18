import { Router, Response } from 'express';
import { authenticate, requireRole, type AuthRequest } from '../middleware/auth';
import GoalSheet from '../models/GoalSheet';
import Goal from '../models/Goal';
import User from '../models/User';
import AuditLog from '../models/AuditLog';
import ExcelJS from 'exceljs';

export const reportsRouter = Router();
reportsRouter.use(authenticate);
reportsRouter.use(requireRole('manager', 'admin'));

/** UoM score calculation (mirrors frontend lib/uom.ts) */
function computeScore(uomType: string, target: number, actual: number): number {
  if (uomType === 'min') return Math.min(100, Math.round((actual / target) * 100));
  if (uomType === 'max') return actual <= 0 ? 100 : Math.min(100, Math.round((target / actual) * 100));
  if (uomType === 'zero') return actual === 0 ? 100 : 0;
  return 0;
}

// Achievement report
reportsRouter.get('/achievement', async (req: AuthRequest, res: Response): Promise<void> => {
  const employees = await User.find({ role: 'employee', isActive: true });
  const report = [];

  for (const emp of employees) {
    const sheet = await GoalSheet.findOne({ employeeId: emp._id }).sort({ createdAt: -1 });
    if (!sheet) continue;
    const goals = await Goal.find({ goalSheetId: sheet._id });
    const scores = goals.map(g => ({ score: computeScore(g.uomType, g.target as any, g.actual as any), weightage: g.weightage }));
    const totalWeight = scores.reduce((s, g) => s + g.weightage, 0);
    const weighted = totalWeight > 0
      ? Math.round(scores.reduce((s, g) => s + (g.score * g.weightage) / 100, 0) / totalWeight * 100)
      : 0;

    report.push({
      employee: emp.name,
      department: emp.department,
      employeeCode: emp.employeeCode,
      sheetStatus: sheet.status,
      goalCount: goals.length,
      weightedScore: weighted,
      goals: goals.map(g => ({ title: g.title, uomType: g.uomType, target: g.target, actual: g.actual, score: computeScore(g.uomType, g.target as any, g.actual as any), weightage: g.weightage })),
    });
  }

  res.json(report);
});

// Export as Excel/CSV
reportsRouter.get('/export', async (req: AuthRequest, res: Response): Promise<void> => {
  const format = (req.query.format as string) || 'csv';
  const employees = await User.find({ role: 'employee', isActive: true });

  const rows: any[] = [];
  for (const emp of employees) {
    const sheet = await GoalSheet.findOne({ employeeId: emp._id }).sort({ createdAt: -1 });
    if (!sheet) continue;
    const goals = await Goal.find({ goalSheetId: sheet._id });
    const scores = goals.map(g => ({ score: computeScore(g.uomType, g.target as any, g.actual as any), weightage: g.weightage }));
    const totalWeight = scores.reduce((s, g) => s + g.weightage, 0);
    const ws = totalWeight > 0 ? Math.round(scores.reduce((s, g) => s + (g.score * g.weightage) / 100, 0) / totalWeight * 100) : 0;

    for (const g of goals) {
      rows.push({
        Employee: emp.name,
        EmployeeCode: emp.employeeCode,
        Department: emp.department,
        SheetStatus: sheet.status,
        GoalTitle: g.title,
        ThrustArea: g.thrustArea,
        UoMType: g.uomType,
        Target: g.target,
        Actual: g.actual,
        Score: `${computeScore(g.uomType, g.target as any, g.actual as any)}%`,
        Weightage: `${g.weightage}%`,
        WeightedScore: `${ws}%`,
        GoalStatus: g.status,
      });
    }
  }

  if (format === 'xlsx') {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Achievement Report');
    if (rows.length > 0) {
      sheet.columns = Object.keys(rows[0]).map(key => ({ header: key, key, width: 20 }));
      sheet.addRows(rows);
      // Style header
      sheet.getRow(1).font = { bold: true };
      sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2D5A3D' } };
      sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    }
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=meridian_report.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } else {
    // CSV
    const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
    const csv = [
      headers.join(','),
      ...rows.map(r => headers.map(h => `"${r[h] ?? ''}"`).join(',')),
    ].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=meridian_report.csv');
    res.send(csv);
  }
});

// Completion summary
reportsRouter.get('/completion', async (req: AuthRequest, res: Response): Promise<void> => {
  const employees = await User.find({ role: 'employee', isActive: true });
  const totalSheets = await GoalSheet.countDocuments();
  const approvedSheets = await GoalSheet.countDocuments({ status: 'approved' });
  const submittedSheets = await GoalSheet.countDocuments({ status: 'submitted' });
  const draftSheets = await GoalSheet.countDocuments({ status: 'draft' });

  res.json({
    totalEmployees: employees.length,
    totalSheets,
    approvedSheets,
    submittedSheets,
    draftSheets,
    approvalRate: totalSheets > 0 ? Math.round((approvedSheets / totalSheets) * 100) : 0,
  });
});
