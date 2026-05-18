import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { JWT_SECRET } from '../middleware/auth';
import { z } from 'zod';

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['employee', 'manager', 'admin']).optional(),
});

authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid credentials format', details: parsed.error.flatten() });
    return;
  }

  const { email, password } = parsed.data;

  try {
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeCode: user.employeeCode,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

authRouter.get('/me', async (req: Request, res: Response): Promise<void> => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET) as any;
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});
