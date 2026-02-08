import { DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/db.js';

interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  deletedAt?: Date | null;
  validatePassword(password: string): Promise<boolean>;
}

const User = sequelize.define<any>(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
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
    hooks: {
      beforeCreate: async (user: any): Promise<void> => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user: any): Promise<void> => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  } as any
);

// Method to validate password
(User.prototype as any).validatePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default User;
