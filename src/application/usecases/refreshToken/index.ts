import jwt, { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

// interface DecodedToken extends JwtPayload {
//   userId: ObjectId; 
// }

interface JwtService {
  verifyRefreshToken(refreshToken: string): any;
  generateAccessToken(userId: ObjectId): string;
}

interface Dependencies {
  TokenService: {
    JwtService: JwtService;
  };
}

export class RefreshToken {
  private jwtService: JwtService;

  constructor(dependencies: Dependencies) {
    this.jwtService = dependencies.TokenService.JwtService;
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = this.jwtService.verifyRefreshToken(refreshToken);
      const newAccessToken = this.jwtService.generateAccessToken(decoded.userId);
      return newAccessToken;
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }
}
