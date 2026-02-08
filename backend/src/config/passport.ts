import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';

interface JwtPayload {
  id: number;
  email: string;
  name: string;
}

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    },
    async (payload: JwtPayload, done: (err: Error | null, user?: any) => void): Promise<void> => {
      try {
        const user = await User.findByPk(payload.id);

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

export default passport;
