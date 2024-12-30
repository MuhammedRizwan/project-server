import { Request, Response, NextFunction } from "express";
import { JwtService } from "../../frameworks/services/jwtService";
import { CustomError } from "../../domain/errors/customError";


const jwtService = new JwtService();

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}

const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Authorization header missing or invalid" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwtService.verifyAccessToken(token);

    // Type guard to check if decoded is of type JwtPayload
    if (typeof decoded === "string" || !decoded.userId) {
      throw new CustomError("Invalid token", 401);
    }

    console.log("Decoded Token:", decoded);

    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default jwtAuth;
