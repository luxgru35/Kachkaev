const { Event } = require('../models');
const { Op } = require('sequelize');

const checkEventLimit = async (req, res, next) => {
  try {
    const userId = req.body.createdBy;
    const maxEventsPerDay = parseInt(process.env.MAX_EVENTS_PER_DAY) || 10;

    // Получить количество мероприятий, созданных пользователем за последние 24 часа
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const eventCount = await Event.count({
      where: {
        createdBy: userId,
        createdAt: {
          [Op.gte]: twentyFourHoursAgo,
        },
        deletedAt: null,
      },
    });

    if (eventCount >= maxEventsPerDay) {
      return res.status(429).json({
        error: `You can only create ${maxEventsPerDay} events per day. Limit exceeded.`,
        currentCount: eventCount,
        limit: maxEventsPerDay,
      });
    }

    next();
  } catch (error) {
    console.error('Error checking event limit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = checkEventLimit;
