import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

interface ITokenBlacklist {
  id: number;
  token: string;
  userId: number;
  expiresAt: Date;
  createdAt: Date;
}

const TokenBlacklist = sequelize.define<any>(
  'TokenBlacklist',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    timestamps: false,
  } as any
);

export default TokenBlacklist;
