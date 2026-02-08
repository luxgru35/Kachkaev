import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';
import { Event, User } from '../models/index.js';
import checkEventLimit from '../middleware/checkEventLimit.js';
import checkTokenBlacklist from '../middleware/checkTokenBlacklist.js';
import passport from 'passport';

interface EventBody {
  title: string;
  description?: string;
  date: string;
  createdBy: number;
}

interface AuthRequest extends Request {
  user?: any;
}

interface QueryParams {
  page?: string;
  limit?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  includeSoftDeleted?: string;
}

const router = Router();

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 */
router.post(
  '/',
  checkTokenBlacklist,
  passport.authenticate('jwt', { session: false }),
  checkEventLimit,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, date, createdBy } = req.body as EventBody;

      if (!title || !date || !createdBy) {
        res.status(400).json({ error: 'Title, date, and createdBy are required' });
        return;
      }

      const user = await User.findByPk(createdBy);
      if (!user || (user as any).deletedAt !== null) {
        res.status(400).json({ error: 'Creator user not found' });
        return;
      }

      const event = await Event.create({
        title,
        description,
        date,
        createdBy,
      });

      const eventWithUser = await Event.findByPk(event.id, {
        include: [{ model: User, as: 'creator' }],
      });

      res.status(201).json(eventWithUser);
    } catch (error: any) {
      console.error('Error creating event:', error);
      res.status(400).json({ error: error.message });
    }
  }
);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events with optional filters
 *     tags: [Events]
 */
router.get('/', checkTokenBlacklist, passport.authenticate('jwt', { session: false }), async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query as QueryParams;
    const page = parseInt(query.page || '1') || 1;
    const limit = parseInt(query.limit || '10') || 10;
    const search = query.search;
    const startDate = query.startDate;
    const endDate = query.endDate;
    const includeSoftDeleted = query.includeSoftDeleted === 'true';

    const offset = (page - 1) * limit;
    const where: any = {};

    // Добавляем фильтр по deletedAt только если не включены удаленные
    if (!includeSoftDeleted) {
      where.deletedAt = null;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.date[Op.lte] = new Date(endDate);
      }
    }

    const { count, rows } = await Event.findAndCountAll({
      where,
      include: [{ model: User, as: 'creator' }],
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 */
router.get('/:id', checkTokenBlacklist, async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findOne({
      where: { id: req.params.id, deletedAt: null },
      include: [{ model: User, as: 'creator' }],
    });

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.json(event);
  } catch (error: any) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 */
router.put(
  '/:id',
  checkTokenBlacklist,
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const event = await Event.findOne({
        where: { id: req.params.id, deletedAt: null },
      });

      if (!event) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }

      const { title, description, date } = req.body;

      if (title) (event as any).title = title;
      if (description) (event as any).description = description;
      if (date) (event as any).date = date;

      await event.save();

      const updatedEvent = await Event.findByPk(event.id, {
        include: [{ model: User, as: 'creator' }],
      });

      res.json(updatedEvent);
    } catch (error: any) {
      console.error('Error updating event:', error);
      res.status(400).json({ error: error.message });
    }
  }
);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Soft delete an event
 *     tags: [Events]
 */
router.delete(
  '/:id',
  checkTokenBlacklist,
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const event = await Event.findByPk(req.params.id as any);

      if (!event) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }

      if ((event as any).deletedAt !== null) {
        res.status(404).json({ error: 'Event already deleted' });
        return;
      }

      await event.update({ deletedAt: new Date() });
      res.json({ message: 'Event deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
