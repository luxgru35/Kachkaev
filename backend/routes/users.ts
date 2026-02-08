import { Router, Request, Response } from 'express';
import { User } from '@models/index.js';
import checkTokenBlacklist from '@middleware/checkTokenBlacklist.js';
import passport from 'passport';

interface AuthRequest extends Request {
  user?: any;
}

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 */
router.get('/', checkTokenBlacklist, async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      where: { deletedAt: null },
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] },
    });
    res.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Soft delete a user
 *     tags: [Users]
 */
router.delete(
  '/:id',
  checkTokenBlacklist,
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findByPk(req.params.id as any);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      if ((user as any).deletedAt !== null) {
        res.status(404).json({ error: 'User already deleted' });
        return;
      }

      await user.update({ deletedAt: new Date() });
      res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
