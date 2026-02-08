const TokenBlacklist = require('../models/TokenBlacklist');
const jwt = require('jsonwebtoken');

const checkTokenBlacklist = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.decode(token);
    if (!decoded) {
      return next();
    }

    // Проверяем, есть ли токен в черном списке
    const blacklistedToken = await TokenBlacklist.findOne({
      where: {
        token,
        userId: decoded.id,
      },
    });

    if (blacklistedToken) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = checkTokenBlacklist;
