import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../repositories/userRepositories";
import { AgentRepository } from "../repositories/agentRepository";
import { CustomError } from "../../domain/errors/customError";

const userRepository = new UserRepository();
const agentRepository = new AgentRepository();
export const userBlocked = async (req: Request, res: Response, next: NextFunction ) => {
  try {
    if (req.user) {  
      const user = await userRepository.getUser(req.user.userId);
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
export const agentBlocked = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user) {
      const agent = await agentRepository.getAgent(req.user.userId);

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
