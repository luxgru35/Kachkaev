const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Title cannot be empty',
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
}, {
  timestamps: false,
  paranoid: false,
});

// Настройка связи один ко многим
Event.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
User.hasMany(Event, { foreignKey: 'createdBy', as: 'events' });

module.exports = Event;
