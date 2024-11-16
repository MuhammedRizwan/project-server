import { NextFunction, Request, Response } from "express";
import { AgentUseCase } from "../../../application/usecases/agent";
import { Iagent } from "../../../domain/entities/agent/agent";
import { AgentVerification } from "../../../application/usecases/agent/agentVerifcation";

interface Dependencies {
  useCase: {
    AgentUseCase: AgentUseCase;
    AgentVerification: AgentVerification;
  };
}

export class agentController {
  private AgentUseCase: AgentUseCase;
  private AgentVerification: AgentVerification;
  constructor(dependencies: Dependencies) {
    this.AgentUseCase = dependencies.useCase.AgentUseCase;
    this.AgentVerification = dependencies.useCase.AgentVerification;
  }
  async createAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const { agency_name, email, phone, location, password } =
        req.body as Iagent;
      const agent = await this.AgentUseCase.signupAgent(
        {
          agency_name,
          email,
          phone,
          location,
          password,
          DocumentURL: undefined,
        },
        { Document: req.file }
      );
      return res
        .status(201)
        .json({ success:true, message: "Agency Registered", agent });
    } catch (error) {
      return next(error);
    }
  }
  async loginAgent(req: Request, res: Response,next:NextFunction) {
    try {
      const { email, password } = req.body as Iagent;
      const { agent, accessToken, refreshToken } =
        await this.AgentUseCase.loginAgent(email, password);
        if (!agent.is_verified) {
          return res.status(403).json({
            status: "error",
            message: "Please verify Email",
            agent,
            redirect: "/agent/verification",
          });
        }
        return res.status(200).json({success:true,message:"Agency Logged In", agent, accessToken,refreshToken });
    } catch (error) {
      return next(error)
    }
  }

  async OTPVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { Otp, agent } = req.body;
      if (!agent) {
        res.status(400).json({ message: "Agency Not Found" });
      }
      if (Otp.length != 4) {
        res.status(400).json({ message: "Incorrect OTP" });
      }
      const agentData= await this.AgentVerification.OTPVerification(
        Otp,
        agent.email
      );
      return res.status(200).json({
        success:true,
        message: "OTP  Verified",
        agent: agentData,
      });
    } catch (error) {
      return next(error);
    }
  }

  async sendOTP(req: Request, res: Response, next: NextFunction) {
    try {      
      const { email } = req.body;
      const OTPData = await this.AgentVerification.sendOTP(email);
      return res.status(200).json({success:true,message:"OTP Resend",OTPData});
    } catch (error) {
      return next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const agent = await this.AgentVerification.changePassword(
        email,
        password
      );
      return res.status(200).json({success:true,message:"Password Changed",agent});
    } catch (error) {
      return next(error);
    }
  }

  async RefreshAccessToken(req: Request, res: Response) {
    try {
      const accessToken = await this.AgentVerification.refreshAccessToken(
        req.body.refreshToken
      );
      return res.status(200).json({ accessToken });
    } catch (error) {
      const err = error as Error;
      return res.status(400).json({ error: err.message });
    }
  }
  async getAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const {agentId}=req.params
      const agent = await this.AgentUseCase.getAgent(agentId);
      return res.status(200).json({success:true,message:"Fetched Agent Data", agent });
    } catch (error) {
      next(error)
    }
  }
  async updateAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const {agentId}=req.params
      const file = req.file as Express.Multer.File;
      const agent = await this.AgentUseCase.updateAgent(agentId,req.body,file);
      return res.status(200).json({success:true,message:"Updated Agent Data", agent });
    } catch (error) {
      next(error)
    }
  }
  async validatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const {agentId}=req.params
      const agent=await this.AgentUseCase.validatePassword(agentId,req.body.oldPassword)
      return res.status(200).json({success:true,message:"password validated", agent });
    } catch (error) {
      next(error)
    }
  }
  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const {agentId}=req.params
      const agent=await this.AgentUseCase.updatePassword(agentId,req.body.newPassword)
      return res.status(200).json({success:true,message:"password updated", agent });
    } catch (error) {
      next(error)
    }
  }
}
