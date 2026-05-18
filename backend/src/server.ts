import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { goalSheetsRouter } from './routes/goalSheets';
import { goalsRouter } from './routes/goals';
import { checkInsRouter } from './routes/checkIns';
import { reportsRouter } from './routes/reports';
import { auditLogsRouter } from './routes/auditLogs';
import { cyclesRouter } from './routes/cycles';
import { usersRouter } from './routes/users';
import { startEscalationCron } from './services/escalationService';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5176',
  credentials: true,
}));
app.use(express.json());

// API routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/goal-sheets', goalSheetsRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/checkins', checkInsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/audit-logs', auditLogsRouter);
app.use('/api/cycles', cyclesRouter);

app.get('/api/health', (_, res) => res.json({ status: 'ok', version: '1.0.0' }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/meridian';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    // Seed initial data
    const { seedDatabase } = await import('./services/seedService');
    await seedDatabase();
    // Start escalation cron
    startEscalationCron();
  })
  .catch(err => console.error('❌ MongoDB error:', err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
