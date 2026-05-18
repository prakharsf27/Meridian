import bcrypt from 'bcryptjs';
import User from '../models/User';
import Cycle from '../models/Cycle';

export async function seedDatabase() {
  // Skip if data already exists
  const existing = await User.countDocuments();
  if (existing > 0) {
    console.log('📦 Database already seeded, skipping...');
    return;
  }

  console.log('🌱 Seeding database...');

  const hash = await bcrypt.hash('demo1234', 10);

  // Create users
  const [admin, manager, emp1, emp2, emp3, emp4] = await User.insertMany([
    { name: 'Kavitha Rao',    email: 'kavitha.rao@meridian.co',   passwordHash: hash, role: 'admin',    department: 'HR',          employeeCode: 'EMP-0001' },
    { name: 'Priya Mehta',    email: 'priya.mehta@meridian.co',   passwordHash: hash, role: 'manager',  department: 'Engineering', employeeCode: 'EMP-0010' },
    { name: 'Rahul Sharma',   email: 'rahul.sharma@meridian.co',  passwordHash: hash, role: 'employee', department: 'Engineering', employeeCode: 'EMP-0042' },
    { name: 'Ananya Nair',    email: 'ananya.nair@meridian.co',   passwordHash: hash, role: 'employee', department: 'Engineering', employeeCode: 'EMP-0053' },
    { name: 'Vikram Kapoor',  email: 'vikram.kapoor@meridian.co', passwordHash: hash, role: 'employee', department: 'Engineering', employeeCode: 'EMP-0061' },
    { name: 'Preethi Sridhar',email: 'preethi.s@meridian.co',    passwordHash: hash, role: 'employee', department: 'Engineering', employeeCode: 'EMP-0034' },
  ]);

  // Set manager relationships
  await User.updateMany(
    { _id: { $in: [emp1._id, emp2._id, emp3._id, emp4._id] } },
    { managerId: manager._id }
  );

  // Create active cycle
  await Cycle.create({
    name: 'FY 2025–26',
    openDate: new Date('2025-04-01'),
    goalSubmissionStart: new Date('2025-04-01'),
    q1Start: new Date('2025-04-01'),
    q2Start: new Date('2025-07-01'),
    q3Start: new Date('2025-10-01'),
    q4Start: new Date('2026-01-01'),
    isActive: true,
  });

  console.log(`✅ Seeded ${await User.countDocuments()} users, 1 cycle.`);
}
