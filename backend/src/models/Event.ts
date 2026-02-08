import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

interface IEvent {
  id: number;
  title: string;
  description?: string;
  date: Date;
  createdBy: number;
  createdAt: Date;
  deletedAt?: Date | null;
}

const Event = sequelize.define<any>(
  'Event',
  {
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
  },
  {
    sequelize,
    timestamps: false,
    paranoid: false,
  } as any
);

// Setup relationship one to many
Event.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
User.hasMany(Event, { foreignKey: 'createdBy', as: 'events' });

export default Event;
