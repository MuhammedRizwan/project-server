import { Request, Response, NextFunction } from "express";
import { JwtService } from "../../frameworks/services/jwtService";
import { CustomError } from "../../domain/errors/customError";
import { MongoUserRepository } from "../repositories/userRepositories";
import { MongoAgentRepository } from "../repositories/agentRepository";

const userRepository = new MongoUserRepository();
const agentRepository = new MongoAgentRepository();

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
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwtService.verifyAccessToken(token);

    // Type guard to check if decoded is of type JwtPayload
    if (typeof decoded === "string" || !decoded.userId) {
      throw new CustomError("Invalid token", 401);
    }

    console.log("Decoded Token:", decoded);

    // Attach the decoded user data to the request object
    req.user = {
      userId: decoded.userId, // Now it's safe to access userId
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default jwtAuth;

export const userBlockedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user) {
      const user = await userRepository.getUser(req?.user.userId as string);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.is_block) {
        return res.status(403).json({ message: "User Blocked" });
      }
    }

    next();
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const agentBlockedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user) {
      const agent = await agentRepository.getAgent(req.user.userId as string);

      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      if (agent.is_block) {
        return res.status(403).json({ message: "Agent Blocked" });
      }
    }
    next();
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
