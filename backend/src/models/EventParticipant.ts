import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

interface IEventParticipant {
  id: number;
  eventId: number;
  userId: number;
  createdAt: Date;
}

const EventParticipant = sequelize.define<any>(
  'EventParticipant',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'EventParticipants',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['eventId', 'userId'],
      },
    ],
  }
);

EventParticipant.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default EventParticipant;
