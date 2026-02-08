const express = require('express');
const router = express.Router();
const { Event, User } = require('../models');
const checkEventLimit = require('../middleware/checkEventLimit');
const checkTokenBlacklist = require('../middleware/checkTokenBlacklist');
const passport = require('passport');
const { Op } = require('sequelize');

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *               - createdBy
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               createdBy:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Bad request
 *       429:
 *         description: Too many events created
 */
router.post('/', checkTokenBlacklist, passport.authenticate('jwt', { session: false }), checkEventLimit, async (req, res) => {
  try {
    const { title, description, date, createdBy } = req.body;

    if (!title || !date || !createdBy) {
      return res
        .status(400)
        .json({ error: 'Title, date, and createdBy are required' });
    }

    const user = await User.findByPk(createdBy);
    if (!user || user.deletedAt !== null) {
      return res.status(400).json({ error: 'Creator user not found' });
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
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events with optional filters
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: List of events
 */
router.get('/', checkTokenBlacklist, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const offset = (page - 1) * limit;

    const where = { deletedAt: null };

    // Фильтрация по поиску
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Фильтрация по диапазону дат
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
      events: rows,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 */
router.get('/:id', checkTokenBlacklist, async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { id: req.params.id, deletedAt: null },
      include: [{ model: User, as: 'creator' }],
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       404:
 *         description: Event not found
 */
router.put('/:id', checkTokenBlacklist, passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { id: req.params.id, deletedAt: null },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const { title, description, date } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;

    await event.save();

    const updatedEvent = await Event.findByPk(event.id, {
      include: [{ model: User, as: 'creator' }],
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Soft delete an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 */
router.delete('/:id', checkTokenBlacklist, passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.deletedAt !== null) {
      return res.status(404).json({ error: 'Event already deleted' });
    }

    await event.update({ deletedAt: new Date() });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
