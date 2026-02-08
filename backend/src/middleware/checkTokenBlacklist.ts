import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import TokenBlacklist from '../models/TokenBlacklist.js';

interface JwtPayload {
  id: number;
  exp?: number;
}

const checkTokenBlacklist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      next();
      return;
    }

    const decoded = jwt.decode(token) as JwtPayload | null;
    if (!decoded) {
      next();
      return;
    }

    const blacklistedToken = await TokenBlacklist.findOne({
      where: {
        token,
        userId: decoded.id,
      },
    });

    if (blacklistedToken) {
      res.status(401).json({ error: 'Token has been revoked' });
      return;
    }

    next();
  } catch (error) {
    next();
  }
};

export default checkTokenBlacklist;
