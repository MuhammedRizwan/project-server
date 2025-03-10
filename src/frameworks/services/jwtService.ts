import jwt from 'jsonwebtoken';
import configKeys from '../../config';


const JWT_SECRET = configKeys.JWT_SECRET;
const REFRESH_TOKEN_SECRET = configKeys.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = '10m'; 
const REFRESH_TOKEN_EXPIRES_IN = '14day';

export class JwtService {

  generateAccessToken(userId: string) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
  }
  generateRefreshToken(userId: string) {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
  }
  verifyAccessToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET); 
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
  verifyRefreshToken(token: string) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  }
}
