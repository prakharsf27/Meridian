import type { UomType } from "./uom";

export interface SeedGoal {
  id: string;
  title: string;
  thrustArea: string;
  uomType: UomType;
  target: number;
  actual: number;
  weightage: number;
  status: "not_started" | "on_track" | "completed" | "lagging";
  locked: boolean;
  isShared: boolean;
  sharedFrom?: string;
  deadlineDate?: string;
  startDate?: string;
}

export interface SeedEmployee {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  employeeCode: string;
  avatarColor: string;
  managerId: string;
  sheetStatus: "draft" | "submitted" | "approved" | "locked";
  goals: SeedGoal[];
}

export const SEED_EMPLOYEES: SeedEmployee[] = [
  {
    id: "emp1",
    name: "Rahul Sharma",
    initials: "RS",
    role: "Senior Engineer",
    department: "Engineering",
    employeeCode: "EMP-0042",
    avatarColor: "bg-emerald-700",
    managerId: "mgr1",
    sheetStatus: "approved",
    goals: [
      { id: "g1", title: "Increase Sales Revenue", thrustArea: "Revenue Growth", uomType: "min", target: 1000000, actual: 700000, weightage: 40, status: "on_track", locked: true, isShared: false },
      { id: "g2", title: "Reduce Bug Count", thrustArea: "Quality", uomType: "max", target: 20, actual: 18, weightage: 20, status: "on_track", locked: true, isShared: false },
      { id: "g3", title: "Complete Certifications", thrustArea: "Learning", uomType: "min", target: 5, actual: 3, weightage: 20, status: "on_track", locked: true, isShared: false },
      { id: "g4", title: "Customer Satisfaction", thrustArea: "Customer", uomType: "min", target: 70, actual: 56, weightage: 10, status: "on_track", locked: true, isShared: true, sharedFrom: "org-nps" },
      { id: "g5", title: "Team Mentorship Hours", thrustArea: "People", uomType: "min", target: 40, actual: 18, weightage: 10, status: "lagging", locked: true, isShared: false },
    ],
  },
  {
    id: "emp2",
    name: "Ananya Nair",
    initials: "AN",
    role: "Backend Engineer",
    department: "Engineering",
    employeeCode: "EMP-0053",
    avatarColor: "bg-blue-700",
    managerId: "mgr1",
    sheetStatus: "submitted",
    goals: [
      { id: "g6", title: "Improve API Response Time", thrustArea: "Performance", uomType: "max", target: 200, actual: 220, weightage: 35, status: "on_track", locked: false, isShared: false },
      { id: "g7", title: "Code Review Turnaround", thrustArea: "Quality", uomType: "max", target: 4, actual: 5, weightage: 25, status: "on_track", locked: false, isShared: false },
      { id: "g8", title: "Documentation Coverage", thrustArea: "Quality", uomType: "min", target: 90, actual: 72, weightage: 25, status: "on_track", locked: false, isShared: false },
      { id: "g9", title: "Bug Fix Velocity", thrustArea: "Quality", uomType: "min", target: 50, actual: 38, weightage: 15, status: "on_track", locked: false, isShared: false },
    ],
  },
  {
    id: "emp3",
    name: "Vikram Kapoor",
    initials: "VK",
    role: "Frontend Engineer",
    department: "Engineering",
    employeeCode: "EMP-0061",
    avatarColor: "bg-yellow-700",
    managerId: "mgr1",
    sheetStatus: "submitted",
    goals: [
      { id: "g10", title: "Improve Lighthouse Score", thrustArea: "Performance", uomType: "min", target: 95, actual: 78, weightage: 30, status: "on_track", locked: false, isShared: false },
      { id: "g11", title: "Zero Critical Prod Incidents", thrustArea: "Reliability", uomType: "zero", target: 0, actual: 0, weightage: 25, status: "completed", locked: false, isShared: false },
      { id: "g12", title: "Feature Delivery Rate", thrustArea: "Delivery", uomType: "min", target: 95, actual: 88, weightage: 25, status: "on_track", locked: false, isShared: false },
      { id: "g13", title: "Accessibility Score", thrustArea: "Quality", uomType: "min", target: 90, actual: 72, weightage: 10, status: "on_track", locked: false, isShared: false },
      { id: "g14", title: "Customer Satisfaction", thrustArea: "Customer", uomType: "min", target: 70, actual: 56, weightage: 10, status: "on_track", locked: false, isShared: true, sharedFrom: "org-nps" },
    ],
  },
  {
    id: "emp4",
    name: "Preethi Sridhar",
    initials: "PS",
    role: "QA Lead",
    department: "Engineering",
    employeeCode: "EMP-0034",
    avatarColor: "bg-pink-700",
    managerId: "mgr1",
    sheetStatus: "approved",
    goals: [
      { id: "g15", title: "Test Coverage", thrustArea: "Quality", uomType: "min", target: 85, actual: 88, weightage: 40, status: "completed", locked: true, isShared: false },
      { id: "g16", title: "Defect Escape Rate", thrustArea: "Quality", uomType: "max", target: 5, actual: 3, weightage: 35, status: "completed", locked: true, isShared: false },
      { id: "g17", title: "Automation Coverage", thrustArea: "Quality", uomType: "min", target: 70, actual: 65, weightage: 15, status: "on_track", locked: true, isShared: false },
      { id: "g18", title: "Customer Satisfaction", thrustArea: "Customer", uomType: "min", target: 70, actual: 80, weightage: 10, status: "on_track", locked: true, isShared: true, sharedFrom: "org-nps" },
    ],
  },
];

export const SEED_ESCALATIONS = [
  { id: "e1", employee: "Ananya Nair", employeeCode: "EMP-0053", rule: "Manager approval overdue", detail: "Submitted 4 days ago. No action from manager Priya Mehta.", severity: "high", triggeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: "e2", employee: "Vikram Kapoor", employeeCode: "EMP-0061", rule: "Manager approval overdue", detail: "Submitted 3 days ago. Requires review.", severity: "high", triggeredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  { id: "e3", employee: "Kiran Raj", employeeCode: "EMP-0078", rule: "Q2 check-in not submitted", detail: "Check-in window opened 6 days ago. No entry logged.", severity: "medium", triggeredAt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
  { id: "e4", employee: "Sunita Bose", employeeCode: "EMP-0089", rule: "Goal sheet not submitted", detail: "Cycle opened 8 days ago. No draft created.", severity: "medium", triggeredAt: new Date(Date.now() - 4 * 60 * 60 * 1000) },
];

export const SEED_AUDIT_LOGS = [
  { id: "a1", entityType: "GoalSheet", entityId: "gs-emp2", action: "SUBMITTED", changedBy: "Ananya Nair", changedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), before: { status: "draft" }, after: { status: "submitted" } },
  { id: "a2", entityType: "Goal", entityId: "g6", action: "EDITED", changedBy: "Ananya Nair", changedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000), before: { target: "150ms" }, after: { target: "200ms" } },
  { id: "a3", entityType: "GoalSheet", entityId: "gs-emp1", action: "APPROVED", changedBy: "Priya Mehta", changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), before: { status: "submitted" }, after: { status: "approved" } },
  { id: "a4", entityType: "Goal", entityId: "g15", action: "UNLOCKED", changedBy: "Kavitha Rao (Admin)", changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), before: { locked: true }, after: { locked: false } },
  { id: "a5", entityType: "Goal", entityId: "g15", action: "UPDATED", changedBy: "Preethi Sridhar", changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), before: { actual: "82" }, after: { actual: "88" } },
  { id: "a6", entityType: "Goal", entityId: "g15", action: "LOCKED", changedBy: "System", changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), before: { locked: false }, after: { locked: true } },
  { id: "a7", entityType: "CheckIn", entityId: "ci-q1-emp1", action: "CREATED", changedBy: "Rahul Sharma", changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), before: null, after: { quarter: "Q1", comment: "On track for revenue goals." } },
  { id: "a8", entityType: "GoalSheet", entityId: "gs-emp3", action: "SUBMITTED", changedBy: "Vikram Kapoor", changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), before: { status: "draft" }, after: { status: "submitted" } },
];

export const DEPT_PERFORMANCE = [
  { dept: "Engineering", q1: 68, q2: 74, employees: 24 },
  { dept: "Sales", q1: 62, q2: 68, employees: 18 },
  { dept: "Marketing", q1: 75, q2: 81, employees: 14 },
  { dept: "Operations", q1: 54, q2: 59, employees: 12 },
];

export const THRUST_DISTRIBUTION = [
  { name: "Revenue Growth", value: 22 },
  { name: "Quality", value: 31 },
  { name: "Customer", value: 18 },
  { name: "Learning", value: 12 },
  { name: "Delivery", value: 10 },
  { name: "People", value: 7 },
];
