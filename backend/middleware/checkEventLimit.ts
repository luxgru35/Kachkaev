import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import Event from '@models/Event.js';

const checkEventLimit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const maxEventsPerDay = parseInt(process.env.MAX_EVENTS_PER_DAY || '10');
    const createdBy = req.body.createdBy;

    if (!createdBy) {
      next();
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const eventsToday = await Event.count({
      where: {
        createdBy,
        createdAt: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
        deletedAt: null,
      },
    });

    if (eventsToday >= maxEventsPerDay) {
      res.status(429).json({
        error: `Too many events created today. Limit: ${maxEventsPerDay} per day`,
        eventsCreatedToday: eventsToday,
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default checkEventLimit;
