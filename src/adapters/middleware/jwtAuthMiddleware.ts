import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../frameworks/services/jwtService'
import { Iuser } from '../../domain/entities/user/user';

export const jwtAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Assuming token comes as "Bearer <token>"

  try {
    const decoded = JwtService.verifyAccessToken(token);
    //req.user = decoded; // Attach the user information to the request object
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
