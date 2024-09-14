import jwt from 'jsonwebtoken';
import configKeys from '../../config';
import { ObjectId } from 'mongoose';

const JWT_SECRET = configKeys.JWT_SECRET || 'your_jwt_secret';
const REFRESH_TOKEN_SECRET = configKeys.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';
const ACCESS_TOKEN_EXPIRES_IN = '15m'; 
const REFRESH_TOKEN_EXPIRES_IN = '7d';

export class JwtService {
  static verifyAccessToken(token: string) {
    throw new Error('Method not implemented.');
  }
   generateAccessToken(userId: ObjectId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
  }
   generateRefreshToken(userId: ObjectId) {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
  }

   verifyAccessToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  }
  verifyRefreshToken(token: string) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  }
}
