import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { User, TokenBlacklist } from '../models/index.js';

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface AuthRequest extends Request {
  user?: any;
}

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body as RegisterBody;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email and password are required' });
      return;
    }

    const existingUser = await User.findOne({ where: { email, deletedAt: null } });
    if (existingUser) {
      res.status(400).json({ error: 'User with this email already exists' });
      return;
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and get JWT token
 *     tags: [Auth]
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginBody;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ where: { email, deletedAt: null } });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user (add token to blacklist)
 *     tags: [Auth]
 */
router.post('/logout', passport.authenticate('jwt', { session: false }), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Token not provided' });
      return;
    }

    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) {
      res.status(400).json({ error: 'Invalid token' });
      return;
    }

    await TokenBlacklist.create({
      token,
      userId: req.user.id,
      expiresAt: new Date(decoded.exp * 1000),
    });

    res.json({ message: 'Logout successful, token has been blacklisted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
